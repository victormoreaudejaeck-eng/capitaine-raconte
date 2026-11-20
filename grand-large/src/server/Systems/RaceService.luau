--!strict
-- Cycle des régates : intermission → pré-départ → course → résultats.
-- Le serveur simule TOUS les bateaux (autorité) à pas fixe, avec le même moteur
-- que le client. Les clients n'envoient que des intentions de barre/voile.

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")

local Shared = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Config = require(Shared.Config)
local Net = require(Shared.Net)
local Types = require(Shared.Types)
local Angles = require(Shared.Util.Angles)
local Geometry = require(Shared.Util.Geometry)
local Noise = require(Shared.Util.Noise)
local BoatClasses = require(Shared.Sailing.BoatClasses)
local Sails = require(Shared.Sailing.Sails)
local Physics = require(Shared.Sailing.Physics)
local Polars = require(Shared.Sailing.Polars)
local Autopilot = require(Shared.Sailing.Autopilot)
local Wind = require(Shared.Sailing.Wind)
local Courses = require(Shared.Race.Courses)
local Checkpoints = require(Shared.Race.Checkpoints)
local SnapshotCodec = require(Shared.Race.SnapshotCodec)

local DataService = require(script.Parent.DataService)
local Entitlements = require(script.Parent.Entitlements)
local WorldService = require(script.Parent.WorldService)
local RateLimit = require(script.Parent.Parent.Util.RateLimit)

type Racer = {
	id: string,
	info: Types.RacerInfo,
	player: Player?,
	boat: BoatClasses.BoatClass,
	ent: Polars.Entitlements,
	state: Physics.BoatState,
	helm: Physics.Helm,
	nextCp: number,
	ocs: boolean,
	started: boolean,
	finished: boolean,
	finishTime: number,
	mem: Autopilot.Memory?,
}

local BOT_NAMES = {
	"Marin_Lou",
	"CapNémo",
	"Albatros",
	"Bora_Bora",
	"Noroît",
	"Mistral_42",
	"Ti'Zef",
	"Goéland",
	"Tramontane",
	"Kraken_Jr",
	"Alizé",
	"Suroît",
	"Mousse_Max",
	"Brise_Marine",
}

local SAIL_INDEX: { [string]: number } = {}
for i, s in Sails.LIST do
	SAIL_INDEX[s.id] = i
end

local RaceService = {}

local rng = Noise.rng(os.time())
local phase: Types.Phase = "intermission"
local phaseEnds = 0
local course: Courses.Course? = nil
local wind: Wind.WindSpec? = nil
local cps: { Checkpoints.Checkpoint } = {}
local scale = 1
local gunTime = 0
local racers: { [string]: Racer } = {}
local results: { Types.ResultRow }? = nil
local simTime = 0
local firstFinishAt: number? = nil

local function now(): number
	return Workspace:GetServerTimeNow()
end

local function racerList(): { Types.RacerInfo }
	local list = {}
	for _, r in racers do
		table.insert(list, r.info)
	end
	table.sort(list, function(a, b)
		return a.id < b.id
	end)
	return list
end

local function statePayload(): Types.RaceStatePayload
	return {
		phase = phase,
		phaseEnds = phaseEnds,
		courseId = if course then course.id else nil,
		wind = wind,
		origin = { 0, 0 },
		scale = scale,
		gunTime = gunTime,
		allowOptions = if course then course.allowOptions else true,
		racers = if phase ~= "intermission" then racerList() else nil,
		results = results,
	}
end

local function broadcastState()
	Net.event("RaceState"):FireAllClients(statePayload())
end

local function raceEvent(payload: { [string]: any })
	Net.event("RaceEvent"):FireAllClients(payload)
end

local function setPhase(p: Types.Phase, duration: number)
	phase = p
	phaseEnds = now() + duration
	broadcastState()
end

-- Tirage pondéré d'un parcours.
local function pickCourse(): Courses.Course
	local total = 0
	for _, c in Courses.LIST do
		total += c.weight
	end
	local roll = rng:next() * total
	for _, c in Courses.LIST do
		roll -= c.weight
		if roll <= 0 then
			return c
		end
	end
	return Courses.LIST[1]
end

local function scaledCourse(c: Courses.Course, s: number): Courses.Course
	local copy = table.clone(c)
	local pts = {}
	for _, p in c.points do
		local q: any = table.clone(p :: any)
		q.x *= s
		q.y *= s
		table.insert(pts, q)
	end
	copy.points = pts :: any
	return copy
end

local function median(values: { number }): number
	if #values == 0 then
		return 1
	end
	table.sort(values)
	return values[math.ceil(#values / 2)]
end

local function addRacer(
	id: string,
	info: Types.RacerInfo,
	player: Player?,
	boat: BoatClasses.BoatClass,
	ent: Polars.Entitlements
)
	racers[id] = {
		id = id,
		info = info,
		player = player,
		boat = boat,
		ent = ent,
		state = Physics.newState(0, 0, 0),
		helm = Physics.newHelm(0),
		nextCp = 1,
		ocs = false,
		started = false,
		finished = false,
		finishTime = 0,
		mem = nil,
	}
end

local function buildFleet(c: Courses.Course)
	racers = {}
	local tcfs: { number } = {}
	local humanBoats: { string } = {}
	for _, player in Players:GetPlayers() do
		local profile = DataService.get(player)
		if profile and profile.settings.autoJoin and #humanBoats < Config.MAX_RACERS then
			local boat = BoatClasses.get(profile.selectedBoat)
				or BoatClasses.get("DINGHY") :: BoatClasses.BoatClass
			local ent = Entitlements.sailing(player, c.allowOptions)
			local id = "p" .. tostring(player.UserId)
			addRacer(id, {
				id = id,
				name = player.DisplayName,
				boat = boat.id,
				isBot = false,
				userId = player.UserId,
				options = ent,
			}, player, boat, ent)
			table.insert(tcfs, boat.tcf)
			table.insert(humanBoats, boat.id)
		end
	end
	-- Bots : bateaux proches de ceux des joueurs, niveaux variés.
	local fleetSize = math.max(Config.MIN_FLEET, #humanBoats)
	local nBots = math.min(Config.MAX_RACERS, fleetSize) - #humanBoats
	local usedNames: { [string]: boolean } = {}
	for i = 1, nBots do
		local boatId = if #humanBoats > 0 then humanBoats[(i - 1) % #humanBoats + 1] else "DINGHY"
		if rng:next() < 0.3 then
			local b = BoatClasses.LIST[math.clamp(
				math.floor(rng:range(1, #BoatClasses.LIST + 0.99)),
				1,
				#BoatClasses.LIST
			)]
			boatId = b.id
		end
		local boat = BoatClasses.get(boatId) :: BoatClasses.BoatClass
		local name
		repeat
			name = BOT_NAMES[math.floor(rng:range(1, #BOT_NAMES + 0.99))]
		until not usedNames[name]
		usedNames[name] = true
		local ent: Polars.Entitlements = if c.allowOptions
			then {
				foils = rng:next() < 0.5,
				sailPack = rng:next() < 0.6,
				proWinches = rng:next() < 0.4,
				autoSail = true,
			}
			else { foils = false, sailPack = false, proWinches = false, autoSail = true }
		local id = "b" .. tostring(i)
		addRacer(
			id,
			{ id = id, name = name, boat = boat.id, isBot = true, userId = 0, options = ent },
			nil,
			boat,
			ent
		)
		local r = racers[id]
		r.mem = Autopilot.newMemory(rng:range(0.35, 0.95), math.floor(rng:next() * 100000))
		table.insert(tcfs, boat.tcf)
	end
	scale = math.clamp(0.53 * median(tcfs), 0.5, 1.15)
end

local function placeOnStartLine()
	local w = wind :: Wind.WindSpec
	local list = {}
	for _, r in racers do
		table.insert(list, r)
	end
	table.sort(list, function(a, b)
		return a.id < b.id
	end)
	for i, r in list do
		local col = (i - 1) % 6
		local row = math.floor((i - 1) / 6)
		local xw = (col - 2.5) * 55
		local yw = -230 - row * 70
		local mx, my = Geometry.rotate(xw, yw, w.twd)
		local heading = Angles.wrap360(w.twd + (if i % 2 == 0 then 95 else -95))
		r.state = Physics.newState(mx, my, heading)
		r.helm = Physics.newHelm(heading)
		r.helm.autoSail = r.ent.autoSail
		r.nextCp = 1
		r.ocs, r.started, r.finished = false, false, false
	end
end

local function packSnapshot(): buffer
	local entries: { SnapshotCodec.Entry } = {}
	for index, info in racerList() do
		local r = racers[info.id]
		local st = r.state
		local flags = 0
		if st.maneuver > 0 then
			flags += 1
		end
		if st.flying then
			flags += 2
		end
		if r.ocs then
			flags += 4
		end
		if r.finished then
			flags += 8
		end
		table.insert(entries, {
			index = index,
			x = st.x,
			y = st.y,
			heading = st.heading,
			speed = st.speed,
			sail = SAIL_INDEX[st.sail] or 1,
			flags = flags,
			nextCp = r.nextCp,
			maneuver = st.maneuver,
		})
	end
	return SnapshotCodec.encode(entries)
end

local function onFinish(r: Racer, t: number)
	r.finished = true
	r.finishTime = t - gunTime
	if not firstFinishAt then
		firstFinishAt = t
	end
	raceEvent({ type = "finish", id = r.id, elapsed = r.finishTime })
end

local function stepRacer(r: Racer, t: number, dt: number)
	if r.finished then
		-- bateau arrivé : il ralentit et dérive doucement
		r.helm.mode = "twa"
		r.helm.value = if r.state.twa >= 0 then 100 else -100
	elseif r.mem then
		local cp = cps[r.nextCp]
		local tx, ty = cp.aimX, cp.aimY
		if t < gunTime then
			-- avant le départ, les bots patientent sous la ligne puis s'élancent
			local remaining = gunTime - t
			if remaining > 12 then
				local dx, dy = Angles.dir((wind :: Wind.WindSpec).twd)
				tx, ty = cp.aimX - dx * 200, cp.aimY - dy * 200
			end
		end
		if r.ocs then
			local dx, dy = Angles.dir((wind :: Wind.WindSpec).twd)
			tx, ty = cp.aimX - dx * 120, cp.aimY - dy * 120
		end
		local h = Autopilot.helm(
			r.state,
			r.boat,
			r.ent,
			wind :: Wind.WindSpec,
			t,
			tx,
			ty,
			r.mem :: Autopilot.Memory
		)
		r.helm.mode, r.helm.value, r.helm.autoSail = h.mode, h.value, true
	end
	local x0, y0 = r.state.x, r.state.y
	Physics.step(r.state, r.helm, r.boat, r.ent, wind :: Wind.WindSpec, t, dt)
	if t < gunTime or r.finished then
		return -- avant le coup de canon, franchir la ligne ne compte pas
	end
	local cp = cps[r.nextCp]
	local c = Checkpoints.crossing(cp, x0, y0, r.state.x, r.state.y)
	if cp.kind == "start" then
		if r.ocs then
			if c == -1 then
				r.ocs = false
			end
		elseif c == 1 then
			r.started = true
			r.nextCp += 1
			raceEvent({ type = "started", id = r.id })
		end
	elseif c == 1 then
		r.nextCp += 1
		if r.nextCp > #cps then
			onFinish(r, t)
		else
			raceEvent({ type = "mark", id = r.id, label = cp.label })
		end
	end
end

local function simulate()
	local t = now()
	local dt = Config.SIM_DT
	-- rattrape au plus 10 pas (évite la spirale si le serveur rame)
	local steps = 0
	while simTime + dt <= t and steps < 10 do
		simTime += dt
		steps += 1
		if simTime - dt < gunTime and simTime >= gunTime then
			-- coup de canon : qui est du mauvais côté ?
			for _, r in racers do
				local d = Geometry.distanceToSegment(
					r.state.x,
					r.state.y,
					cps[1].ax,
					cps[1].ay,
					cps[1].bx,
					cps[1].by
				)
				if Checkpoints.onCourseSide(cps[1], r.state.x, r.state.y) and d < 600 then
					r.ocs = true
					raceEvent({ type = "ocs", id = r.id })
				end
			end
		end
		for _, r in racers do
			stepRacer(r, simTime, dt)
		end
	end
	if simTime + dt * 10 < t then
		simTime = t -- trop de retard : on saute
	end
end

local function computeResults(): { Types.ResultRow }
	local rows: { Types.ResultRow } = {}
	for _, r in racers do
		table.insert(rows, {
			id = r.id,
			name = r.info.name,
			boat = r.boat.id,
			isBot = r.info.isBot,
			finished = r.finished,
			elapsed = r.finishTime,
			corrected = r.finishTime * r.boat.tcf,
			position = 0,
			coins = nil,
		})
	end
	table.sort(rows, function(a, b)
		if a.finished ~= b.finished then
			return a.finished
		end
		if a.finished then
			return a.corrected < b.corrected
		end
		local ra, rb = racers[a.id], racers[b.id]
		if ra.nextCp ~= rb.nextCp then
			return ra.nextCp > rb.nextCp
		end
		return Checkpoints.remaining(cps, ra.nextCp, ra.state.x, ra.state.y)
			< Checkpoints.remaining(cps, rb.nextCp, rb.state.x, rb.state.y)
	end)
	local n = #rows
	for i, row in rows do
		row.position = i
		local r = racers[row.id]
		if r.player and r.player.Parent == Players then
			local player = r.player :: Player
			local coins = if row.finished
				then Config.REWARD_FINISH + (n - i) * Config.REWARD_PER_BOAT_BEATEN + (if i == 1
					then Config.REWARD_WIN_BONUS
					else 0)
				else Config.REWARD_DNF
			coins = math.floor(coins * r.boat.coinMultiplier)
			if Entitlements.isVip(player) then
				coins *= Config.VIP_COIN_MULTIPLIER
			end
			local xp = if row.finished then 40 + (n - i) * 12 else 10
			row.coins = coins
			DataService.update(player, function(p)
				p.coins += coins
				p.xp += xp
				p.stats.races += 1
				if row.finished and i == 1 then
					p.stats.wins += 1
				end
				if row.finished and i <= 3 then
					p.stats.podiums += 1
				end
			end)
			Net.event("Notify"):FireClient(player, "n_finish", { i, coins })
		end
	end
	return rows
end

local function anyHumanRacing(): boolean
	for _, r in racers do
		if r.player and r.player.Parent == Players and not r.finished then
			return true
		end
	end
	return false
end

local function allFinished(): boolean
	for _, r in racers do
		if not r.finished then
			return false
		end
	end
	return true
end

local function runCycle()
	-- 1. Intermission
	results = nil
	racers = {}
	setPhase("intermission", Config.INTERMISSION)
	while now() < phaseEnds do
		task.wait(0.5)
	end

	-- 2. Préparation : parcours, vent, flotte
	local c = pickCourse()
	course = c
	buildFleet(c)
	local twsBase = rng:range(c.twsRange[1], c.twsRange[2])
	wind = {
		twd = math.floor(rng:range(0, 360)),
		tws = math.floor(twsBase * 10) / 10,
		shiftAmp = c.shiftAmp,
		shiftPeriod = rng:range(180, 320),
		gustAmp = c.gustAmp,
		gustScale = rng:range(700, 1100),
		seed = math.floor(rng:next() * 1e6),
	}
	cps = Checkpoints.compile(scaledCourse(c, scale), 0, 0, (wind :: Wind.WindSpec).twd)
	WorldService.buildCourse(cps)
	placeOnStartLine()
	gunTime = now() + Config.PRESTART
	simTime = now()
	firstFinishAt = nil
	setPhase("prestart", Config.PRESTART)

	-- 3. Pré-départ + course (même boucle de simulation)
	local snapshot = Net.unreliable("Snapshot")
	local lastSnap = 0
	local conn = RunService.Heartbeat:Connect(function()
		if phase == "prestart" and now() >= gunTime then
			phase = "racing"
			phaseEnds = gunTime + Config.RACE_TIMEOUT
			broadcastState()
			raceEvent({ type = "gun" })
		end
		simulate()
		local t = os.clock()
		if t - lastSnap >= 1 / Config.SNAPSHOT_RATE then
			lastSnap = t
			snapshot:FireAllClients(simTime, packSnapshot())
		end
	end)

	while true do
		task.wait(0.25)
		if phase == "racing" then
			local t = now()
			if allFinished() or t >= phaseEnds then
				break
			end
			if firstFinishAt and t - (firstFinishAt :: number) > Config.AFTER_FIRST_FINISH then
				break
			end
			if not anyHumanRacing() and (firstFinishAt or t - gunTime > 20) then
				-- plus aucun humain en course : on écourte
				if t - gunTime > 20 then
					break
				end
			end
		end
	end
	conn:Disconnect()

	-- 4. Résultats
	results = computeResults()
	setPhase("results", Config.RESULTS)
	task.wait(Config.RESULTS)
end

-- Entrées joueur (validées).
local function racerOf(player: Player): Racer?
	return racers["p" .. tostring(player.UserId)]
end

local function onHelm(player: Player, mode: unknown, value: unknown)
	if not RateLimit.allow(player, "Helm", 15, 20) then
		return
	end
	if (mode ~= "heading" and mode ~= "twa") or typeof(value) ~= "number" or not Angles.isFinite(value) then
		return
	end
	local r = racerOf(player)
	if not r or r.finished then
		return
	end
	if mode == "twa" then
		r.helm.mode = "twa"
		r.helm.value = math.clamp(value, -180, 180)
	else
		r.helm.mode = "heading"
		r.helm.value = Angles.wrap360(value)
	end
end

local function onSail(player: Player, sailId: unknown)
	if not RateLimit.allow(player, "Sail", 4, 6) or not Sails.isValid(sailId) then
		return
	end
	local r = racerOf(player)
	if not r then
		return
	end
	r.helm.sail = sailId :: string
	r.helm.autoSail = false
end

local function onAutoSail(player: Player, on: unknown)
	if not RateLimit.allow(player, "AutoSail", 4, 6) or typeof(on) ~= "boolean" then
		return
	end
	local r = racerOf(player)
	if r then
		r.helm.autoSail = on
	end
end

function RaceService.start()
	Net.event("Ready").OnServerEvent:Connect(function(player)
		if RateLimit.allow(player, "Ready", 1, 3) then
			Net.event("RaceState"):FireClient(player, statePayload())
			Entitlements.push(player)
		end
	end)
	Net.event("Helm").OnServerEvent:Connect(onHelm)
	Net.event("Sail").OnServerEvent:Connect(onSail)
	Net.event("AutoSail").OnServerEvent:Connect(onAutoSail)
	Players.PlayerRemoving:Connect(function(player)
		local r = racerOf(player)
		if r then
			r.player = nil -- le bateau reste, piloté par personne (classé DNF s'il n'arrive pas)
		end
	end)
	while true do
		local ok, err = pcall(runCycle :: any)
		if not ok then
			warn("[RaceService] erreur de cycle : " .. tostring(err))
			task.wait(3)
		end
	end
end

return RaceService
