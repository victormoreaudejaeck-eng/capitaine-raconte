--!strict
-- État de course côté client : phase, parcours, flotte, positions reçues
-- (interpolées pour les autres) et PRÉDICTION de son propre bateau
-- (même moteur que le serveur, corrigé en douceur par les snapshots).

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")

local Shared = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Config = require(Shared.Config)
local Net = require(Shared.Net)
local Types = require(Shared.Types)
local Signal = require(Shared.Util.Signal)
local Angles = require(Shared.Util.Angles)
local Sails = require(Shared.Sailing.Sails)
local BoatClasses = require(Shared.Sailing.BoatClasses)
local Physics = require(Shared.Sailing.Physics)
local Polars = require(Shared.Sailing.Polars)
local Wind = require(Shared.Sailing.Wind)
local Courses = require(Shared.Race.Courses)
local Checkpoints = require(Shared.Race.Checkpoints)
local SnapshotCodec = require(Shared.Race.SnapshotCodec)

export type Pose = {
	x: number,
	y: number,
	heading: number,
	speed: number,
	sail: string,
	flying: boolean,
	maneuver: number,
	ocs: boolean,
	finished: boolean,
	nextCp: number,
	twa: number,
	tws: number,
	twd: number,
}

type Snap = {
	t: number,
	x: number,
	y: number,
	h: number,
	speed: number,
	sail: string,
	flags: number,
	nextCp: number,
	maneuver: number,
}

local RaceClient = {}
RaceClient.StateChanged = Signal.new() :: Signal.Signal<Types.RaceStatePayload>
RaceClient.Event = Signal.new() :: Signal.Signal<{ [string]: any }>
RaceClient.ProfileChanged = Signal.new() :: Signal.Signal<Types.PublicProfile>
RaceClient.Notify = Signal.new() :: Signal.Signal<string, { any }?>

RaceClient.state = nil :: Types.RaceStatePayload?
RaceClient.profile = nil :: Types.PublicProfile?
RaceClient.cps = {} :: { Checkpoints.Checkpoint }
RaceClient.roster = {} :: { [string]: Types.RacerInfo }
RaceClient.myId = "p" .. tostring(Players.LocalPlayer.UserId)

local buffers: { [string]: { Snap } } = {}
local order: { [number]: string } = {} -- index du snapshot → id du concurrent (liste triée par id)
local INTERP_DELAY = 0.2

-- Prédiction locale
local myState: Physics.BoatState? = nil
local myHelm: Physics.Helm = Physics.newHelm(0)
local myBoat: BoatClasses.BoatClass? = nil
local myEnt: Polars.Entitlements = Polars.NO_OPTIONS
local predTime = 0
local history: { { t: number, x: number, y: number, h: number, speed: number } } = {}
local correction = { x = 0, y = 0, h = 0, speed = 0 }

function RaceClient.serverNow(): number
	return Workspace:GetServerTimeNow()
end

function RaceClient.wind(): Wind.WindSpec?
	local s = RaceClient.state
	return if s then s.wind else nil
end

function RaceClient.isRacing(): boolean
	local s = RaceClient.state
	return s ~= nil
		and (s.phase == "prestart" or s.phase == "racing")
		and RaceClient.roster[RaceClient.myId] ~= nil
end

function RaceClient.myBoat(): BoatClasses.BoatClass?
	return myBoat
end

function RaceClient.myEntitlements(): Polars.Entitlements
	return myEnt
end

function RaceClient.helm(): Physics.Helm
	return myHelm
end

function RaceClient.myPredicted(): Physics.BoatState?
	return myState
end

local function onRaceState(payload: Types.RaceStatePayload)
	RaceClient.state = payload
	RaceClient.roster = {}
	order = {}
	if payload.racers then
		for i, r in payload.racers do
			RaceClient.roster[r.id] = r
			order[i] = r.id
		end
	end
	if payload.phase == "intermission" then
		buffers = {}
		RaceClient.cps = {}
	end
	if payload.courseId and payload.wind and payload.scale then
		local c = Courses.get(payload.courseId)
		if c then
			local pts = {}
			for _, p in c.points do
				local q: any = table.clone(p :: any)
				q.x *= payload.scale
				q.y *= payload.scale
				table.insert(pts, q)
			end
			local scaled = table.clone(c)
			scaled.points = pts :: any
			RaceClient.cps = Checkpoints.compile(scaled, 0, 0, payload.wind.twd)
		end
	end
	local me = RaceClient.roster[RaceClient.myId]
	if me and (payload.phase == "prestart" or payload.phase == "racing") then
		myBoat = BoatClasses.get(me.boat)
		myEnt = me.options
		if not myState then
			myHelm.autoSail = myEnt.autoSail
		end
	else
		myState = nil
		myBoat = nil
		history = {}
	end
	RaceClient.StateChanged:Fire(payload)
end

local function onSnapshot(t: unknown, data: unknown)
	if typeof(t) ~= "number" or typeof(data) ~= "buffer" then
		return
	end
	for _, e in SnapshotCodec.decode(data) do
		local id = order[e.index]
		if not id then
			continue
		end
		local sailDef = Sails.LIST[e.sail] or Sails.LIST[1]
		local snap: Snap = {
			t = t,
			x = e.x,
			y = e.y,
			h = e.heading,
			speed = e.speed,
			sail = sailDef.id,
			flags = e.flags,
			nextCp = e.nextCp,
			maneuver = e.maneuver,
		}
		local buf = buffers[id]
		if not buf then
			buf = {}
			buffers[id] = buf
		end
		table.insert(buf, snap)
		while #buf > 30 do
			table.remove(buf, 1)
		end
		if id == RaceClient.myId and myBoat then
			if not myState then
				-- premier snapshot : on démarre la prédiction depuis l'état serveur
				local s = Physics.newState(snap.x, snap.y, snap.h)
				s.speed = snap.speed
				s.sail = snap.sail
				myState = s
				predTime = t
				myHelm.mode = "heading"
				myHelm.value = snap.h
				myHelm.sail = snap.sail
			else
				-- comparer avec notre prédiction au même instant, corriger progressivement
				local best = nil
				for i = #history, 1, -1 do
					if math.abs(history[i].t - t) < 0.051 then
						best = history[i]
						break
					end
				end
				local s = myState :: Physics.BoatState
				if best then
					local ex, ey = snap.x - best.x, snap.y - best.y
					if ex * ex + ey * ey > 60 * 60 then
						s.x, s.y, s.heading, s.speed = snap.x, snap.y, snap.h, snap.speed
						correction = { x = 0, y = 0, h = 0, speed = 0 }
					else
						correction.x = ex
						correction.y = ey
						correction.h = Angles.diff(best.h, snap.h)
						correction.speed = snap.speed - best.speed
					end
				end
				s.sail = snap.sail
				if snap.maneuver > s.maneuver + 0.5 then
					s.maneuver = snap.maneuver
				end
			end
		end
	end
end

local function samplePose(id: string, renderT: number): Pose?
	local buf = buffers[id]
	if not buf or #buf == 0 then
		return nil
	end
	local a, b = buf[1], buf[#buf]
	for i = #buf - 1, 1, -1 do
		if buf[i].t <= renderT then
			a, b = buf[i], buf[i + 1]
			break
		end
	end
	local alpha = if b.t > a.t then math.clamp((renderT - a.t) / (b.t - a.t), 0, 1.5) else 1
	local x = a.x + (b.x - a.x) * alpha
	local y = a.y + (b.y - a.y) * alpha
	local h = Angles.wrap360(a.h + Angles.diff(a.h, b.h) * alpha)
	local w = RaceClient.wind()
	local twd, tws = 0, 0
	if w then
		twd, tws = Wind.sample(w, x, y, renderT)
	end
	return {
		x = x,
		y = y,
		heading = h,
		speed = a.speed + (b.speed - a.speed) * alpha,
		sail = b.sail,
		flying = bit32.band(b.flags, 2) ~= 0,
		maneuver = b.maneuver,
		ocs = bit32.band(b.flags, 4) ~= 0,
		finished = bit32.band(b.flags, 8) ~= 0,
		nextCp = b.nextCp,
		twa = Angles.twa(twd, h),
		tws = tws,
		twd = twd,
	}
end

-- Pose de rendu d'un concurrent (le sien = prédiction, les autres = interpolation).
function RaceClient.pose(id: string): Pose?
	if id == RaceClient.myId and myState then
		local s = myState :: Physics.BoatState
		local last = buffers[id] and buffers[id][#buffers[id]]
		return {
			x = s.x,
			y = s.y,
			heading = s.heading,
			speed = s.speed,
			sail = s.sail,
			flying = s.flying,
			maneuver = s.maneuver,
			ocs = if last then bit32.band(last.flags, 4) ~= 0 else false,
			finished = if last then bit32.band(last.flags, 8) ~= 0 else false,
			nextCp = if last then last.nextCp else 1,
			twa = s.twa,
			tws = s.tws,
			twd = s.twd,
		}
	end
	return samplePose(id, RaceClient.serverNow() - INTERP_DELAY)
end

function RaceClient.ids(): { string }
	local out = {}
	for id in buffers do
		if RaceClient.roster[id] then
			table.insert(out, id)
		end
	end
	return out
end

-- Classement en direct (bateaux arrivés d'abord, puis bouée suivante, puis distance restante).
function RaceClient.ranking(): { { id: string, pose: Pose } }
	local list = {}
	for _, id in RaceClient.ids() do
		local p = RaceClient.pose(id)
		if p then
			table.insert(list, { id = id, pose = p })
		end
	end
	local cps = RaceClient.cps
	table.sort(list, function(a, b)
		if a.pose.nextCp ~= b.pose.nextCp then
			return a.pose.nextCp > b.pose.nextCp
		end
		if #cps == 0 then
			return a.id < b.id
		end
		return Checkpoints.remaining(cps, a.pose.nextCp, a.pose.x, a.pose.y)
			< Checkpoints.remaining(cps, b.pose.nextCp, b.pose.x, b.pose.y)
	end)
	return list
end

local function stepPrediction()
	local s = myState
	local boat = myBoat
	local w = RaceClient.wind()
	if not s or not boat or not w then
		return
	end
	local now = RaceClient.serverNow()
	local dt = Config.SIM_DT
	local steps = 0
	while predTime + dt <= now and steps < 10 do
		predTime += dt
		steps += 1
		Physics.step(s, myHelm, boat, myEnt, w, predTime, dt)
		-- correction douce (10 % par pas)
		local k = 0.1
		s.x += correction.x * k
		s.y += correction.y * k
		s.heading = Angles.wrap360(s.heading + correction.h * k)
		s.speed = math.max(0, s.speed + correction.speed * k)
		correction.x *= 1 - k
		correction.y *= 1 - k
		correction.h *= 1 - k
		correction.speed *= 1 - k
		table.insert(history, { t = predTime, x = s.x, y = s.y, h = s.heading, speed = s.speed })
		if #history > 60 then
			table.remove(history, 1)
		end
	end
	if predTime + dt * 10 < now then
		predTime = now
	end
end

function RaceClient.init()
	Net.event("RaceState").OnClientEvent:Connect(onRaceState)
	Net.unreliable("Snapshot").OnClientEvent:Connect(onSnapshot)
	Net.event("RaceEvent").OnClientEvent:Connect(function(payload)
		RaceClient.Event:Fire(payload)
	end)
	Net.event("Profile").OnClientEvent:Connect(function(view)
		RaceClient.profile = view
		RaceClient.ProfileChanged:Fire(view)
	end)
	Net.event("Notify").OnClientEvent:Connect(function(key, args)
		RaceClient.Notify:Fire(key, args)
	end)
end

function RaceClient.start()
	RunService.Heartbeat:Connect(stepPrediction)
	task.wait(0.5) -- laisse les autres contrôleurs se brancher sur les signaux
	Net.event("Ready"):FireServer()
end

return RaceClient
