--!strict
-- Tests du moteur de voile. Lancer depuis grand-large/ :  lune run tests/run
local Loader = require("./loader")

local shared = Loader.root("src/shared")
local R = Loader.require
local Angles = R(shared.Util.Angles)
local Noise = R(shared.Util.Noise)
local Sails = R(shared.Sailing.Sails)
local BoatClasses = R(shared.Sailing.BoatClasses)
local Polars = R(shared.Sailing.Polars)
local Wind = R(shared.Sailing.Wind)
local Physics = R(shared.Sailing.Physics)
local Autopilot = R(shared.Sailing.Autopilot)
local Courses = R(shared.Race.Courses)
local Checkpoints = R(shared.Race.Checkpoints)
local Config = R(shared.Config)
local SnapshotCodec = R(shared.Race.SnapshotCodec)

local passed, failed = 0, 0
local function test(name: string, fn: () -> ())
	local ok, err = pcall(fn)
	if ok then
		passed += 1
		print("  ok  " .. name)
	else
		failed += 1
		print("  ÉCHEC " .. name .. "\n       " .. tostring(err))
	end
end
local function check(cond: boolean, msg: string)
	if not cond then
		error(msg, 2)
	end
end

local ALL = { foils = true, sailPack = true, proWinches = true, autoSail = true }
local NONE = Polars.NO_OPTIONS
local AUTO_ONLY = { foils = false, sailPack = false, proWinches = false, autoSail = true }

print("Angles & bruit")
test("wrap180 / diff", function()
	check(Angles.wrap180(190) == -170, "wrap180(190)")
	check(Angles.diff(350, 10) == 20, "diff 350→10")
	check(math.abs(Angles.bearing(0, 0, 1, 0) - 90) < 1e-9, "bearing est")
end)
test("bruit déterministe et borné", function()
	local a = Noise.noise3(1.3, -4.2, 7.7, 42)
	check(a == Noise.noise3(1.3, -4.2, 7.7, 42), "déterminisme")
	for i = 1, 2000 do
		local v = Noise.noise3(i * 0.37, i * -0.11, i * 0.05, 9)
		check(v >= -1 and v <= 1, "borne")
	end
end)

print("Polaires & voiles")
test("zone morte face au vent", function()
	for _, b in BoatClasses.LIST do
		local v = Polars.bestSpeed(b, ALL, 15, 15)
		check(v < 0.5, b.id .. " avance face au vent : " .. v)
	end
end)
test("chaque bateau atteint ~vmax au reaching", function()
	for _, b in BoatClasses.LIST do
		local v = Polars.bestSpeed(b, NONE, 110, 25)
		check(v > b.vmax * 0.5, b.id .. " trop lent : " .. v)
	end
end)
test("angles VMG réalistes", function()
	for _, b in BoatClasses.LIST do
		local up = Polars.bestVmgTwa(b, NONE, 14, true)
		local down = Polars.bestVmgTwa(b, NONE, 14, false)
		check(up >= 34 and up <= 60, b.id .. " près=" .. up)
		check(down >= 120 and down <= 180, b.id .. " portant=" .. down)
		print(string.format("       %-9s près %4.1f°  portant %5.1f°", b.id, up, down))
	end
end)
test("le Pack Voiles et les Foils donnent un avantage mesurable mais pas énorme", function()
	local b = BoatClasses.get("OCEAN60")
	local worst, total, n = 0, 0, 0
	for tws = 6, 30, 4 do
		for twa = 50, 170, 10 do
			local base = Polars.bestSpeed(b, NONE, twa, tws)
			local full = Polars.bestSpeed(b, ALL, twa, tws)
			local gain = full / base - 1
			check(gain >= -1e-9, "jamais plus lent avec options")
			worst = math.max(worst, gain)
			total += gain
			n += 1
		end
	end
	print(
		string.format(
			"       OCEAN60 gain options : moyen %.1f %%, max %.1f %%",
			total / n * 100,
			worst * 100
		)
	)
	check(worst < 0.35 and total / n < 0.15, "gain trop fort")
end)
test("les voiles de base couvrent tout le domaine", function()
	for twa = 40, 180, 5 do
		for tws = 2, 40, 2 do
			local _, eff = Sails.best(twa, tws, false)
			check(
				eff >= (if tws > 30 then 0.75 else 0.85),
				"trou à " .. twa .. "°/" .. tws .. "kn : " .. eff
			)
		end
	end
end)

print("Physique")
local wind = { twd = 0, tws = 15, shiftAmp = 0, shiftPeriod = 300, gustAmp = 0, gustScale = 900, seed = 1 }
test("accélère jusqu'à la vitesse cible au travers", function()
	local b = BoatClasses.get("OCEAN40")
	local s = Physics.newState(0, 0, 90)
	local h = Physics.newHelm(90)
	for i = 1, 600 do
		Physics.step(s, h, b, AUTO_ONLY, wind, i * 0.1, 0.1)
	end
	check(math.abs(s.speed - s.target) < 0.05, "pas stabilisé")
	check(s.x > 1000 and math.abs(s.y) < 1, "déplacement vers l'est attendu")
end)
test("virement : pénalité et événement", function()
	local b = BoatClasses.get("OCEAN40")
	local s = Physics.newState(0, 0, 315) -- vent du nord, TWA +45
	local h = { mode = "twa", value = 45, sail = "JIB", autoSail = false }
	for i = 1, 300 do
		Physics.step(s, h, b, NONE, wind, i * 0.1, 0.1)
	end
	local before = s.speed
	h.value = -45
	local sawTack = false
	for i = 301, 360 do
		local ev = Physics.step(s, h, b, NONE, wind, i * 0.1, 0.1)
		if ev == "tack" then
			sawTack = true
		end
	end
	check(sawTack, "virement non détecté")
	check(s.speed < before, "pas de perte de vitesse")
	check(s.twa < 0, "mauvais bord après virement")
end)
test("les Winchs Pro raccourcissent la manœuvre", function()
	local b = BoatClasses.get("OCEAN60")
	local function maneuverAfterTack(ent): number
		local s = Physics.newState(0, 0, 315)
		local h = { mode = "twa", value = 45, sail = "JIB", autoSail = false }
		for i = 1, 100 do
			Physics.step(s, h, b, ent, wind, i * 0.1, 0.1)
		end
		h.value = -45
		local maxM = 0
		for i = 101, 200 do
			Physics.step(s, h, b, ent, wind, i * 0.1, 0.1)
			maxM = math.max(maxM, s.maneuver)
		end
		return maxM
	end
	check(maneuverAfterTack(ALL) < maneuverAfterTack(NONE) * 0.7, "pas d'effet")
end)
test("voile verrouillée refusée sans Pack Voiles", function()
	local b = BoatClasses.get("OCEAN40")
	local s = Physics.newState(0, 0, 90)
	Physics.step(s, { mode = "heading", value = 90, sail = "C0", autoSail = false }, b, NONE, wind, 0, 0.1)
	check(s.sail == "JIB", "C0 accepté sans pack")
	Physics.step(s, { mode = "heading", value = 90, sail = "C0", autoSail = false }, b, ALL, wind, 0, 0.1)
	check(s.sail == "C0", "C0 refusé avec pack")
end)
test("le catamaran volant décolle avec du vent", function()
	local b = BoatClasses.get("FOILCAT")
	local s = Physics.newState(0, 0, 100)
	local h = Physics.newHelm(100)
	for i = 1, 400 do
		Physics.step(s, h, b, AUTO_ONLY, wind, i * 0.1, 0.1)
	end
	check(s.flying, "ne vole pas à 15 nœuds")
end)

print("Parcours & franchissements")
test("bouée à bâbord : bon côté accepté, mauvais refusé", function()
	local c = {
		points = {
			{ kind = "start", x = 0, y = 0, width = 300 },
			{ kind = "mark", x = 0, y = 1000, side = "port", name = "1" },
			{ kind = "finish", x = 0, y = 0, width = 300 },
		},
	}
	local cps = Checkpoints.compile(c :: any, 0, 0, 0)
	local m = cps[2]
	-- passer à DROITE de la bouée en montant (bouée à gauche = bâbord) : coupe la demi-droite est
	check(Checkpoints.crossing(m, 30, 990, 30, 1010) == 1, "passage correct refusé")
	-- passer à gauche (ouest) : ne coupe pas la demi-droite
	check(Checkpoints.crossing(m, -30, 990, -30, 1010) == 0, "mauvais côté accepté")
	-- traverser en redescendant : sens inverse
	check(Checkpoints.crossing(m, 30, 1010, 30, 990) == -1, "sens inverse")
end)
test("ligne de départ : sens et côté parcours", function()
	local cps = Checkpoints.compile(Courses.get("BANANA"), 0, 0, 0)
	local s = cps[1]
	check(Checkpoints.crossing(s, 0, -10, 0, 10) == 1, "départ vers le vent refusé")
	check(Checkpoints.crossing(s, 0, 10, 0, -10) == -1, "retour non détecté")
	check(Checkpoints.onCourseSide(s, 0, 50), "côté parcours")
	check(not Checkpoints.onCourseSide(s, 0, -50), "côté pré-départ")
end)
test("rotation du parcours selon le vent", function()
	local cps = Checkpoints.compile(Courses.get("BANANA"), 0, 0, 90) -- vent d'est
	local m = cps[2]
	check(m.ax > 1800 and math.abs(m.ay) < 1, "la bouée au vent doit être à l'est")
end)

print("Réseau")
test("snapshot binaire : 12 bateaux tiennent sous 900 octets et se relisent", function()
	local entries = {}
	for i = 1, 12 do
		table.insert(
			entries,
			{
				index = i,
				x = 1234.5 + i,
				y = -2222.25,
				heading = 359.99,
				speed = 31.27,
				sail = 7,
				flags = 11,
				nextCp = 4,
				maneuver = 6.3,
			}
		)
	end
	local b = SnapshotCodec.encode(entries)
	check(buffer.len(b) < 900, "trop gros : " .. buffer.len(b))
	local d = SnapshotCodec.decode(b)
	check(#d == 12 and d[5].index == 5, "décodage")
	check(math.abs(d[3].x - 1237.5) < 0.01 and math.abs(d[3].heading - 359.99) < 0.006, "précision")
	check(d[1].flags == 11 and d[1].sail == 7 and math.abs(d[1].maneuver - 6.3) < 0.051, "champs")
end)

print("Courses complètes avec l'IA (tous parcours × tous bateaux)")
local function simulateRace(course, boat, ent, twd: number, tws: number, seed: number): (boolean, number)
	local w = {
		twd = twd,
		tws = tws,
		shiftAmp = course.shiftAmp,
		shiftPeriod = 240,
		gustAmp = course.gustAmp,
		gustScale = 900,
		seed = seed,
	}
	local cps = Checkpoints.compile(course, 0, 0, twd)
	local sx, sy = Angles.dir(twd)
	local s = Physics.newState(-sx * 120, -sy * 120, Angles.wrap360(twd + 90))
	local mem = Autopilot.newMemory(1, seed)
	local nextCp = 1
	local dt = Config.SIM_DT
	local t = 0
	while t < 1800 do
		t += dt
		local cp = cps[nextCp]
		local h = Autopilot.helm(s, boat, ent, w, t, cp.aimX, cp.aimY, mem)
		local x0, y0 = s.x, s.y
		Physics.step(s, h, boat, ent, w, t, dt)
		if Checkpoints.crossing(cp, x0, y0, s.x, s.y) == 1 then
			nextCp += 1
			if nextCp > #cps then
				return true, t
			end
		end
	end
	return false, t
end
for _, course in Courses.LIST do
	for _, boat in BoatClasses.LIST do
		test(course.id .. " / " .. boat.id, function()
			for k, twd in { 0, 137, 250 } do
				local tws = course.twsRange[1] + (course.twsRange[2] - course.twsRange[1]) * (k / 3)
				local ok, t = simulateRace(course, boat, AUTO_ONLY, twd, tws, k * 11 + 3)
				check(ok, string.format("non fini (vent %d° %.0f kn) après %.0fs", twd, tws, t))
				if k == 1 then
					print(string.format("       %-9s %-9s %4.0f s (%.0f kn)", course.id, boat.id, t, tws))
				end
			end
		end)
	end
end

test("un bateau avec options finit devant le même sans options", function()
	local course = Courses.get("TRIANGLE")
	local boat = BoatClasses.get("OCEAN60")
	local _, tFull = simulateRace(course, boat, ALL, 30, 16, 5)
	local _, tNone = simulateRace(course, boat, AUTO_ONLY, 30, 16, 5)
	print(
		string.format(
			"       options : %.0fs  /  sans : %.0fs  (%.1f %%)",
			tFull,
			tNone,
			(1 - tFull / tNone) * 100
		)
	)
	check(tFull < tNone, "les options ne servent à rien")
end)

print(string.format("\n%d réussis, %d échoués", passed, failed))
if failed > 0 then
	local process = require("@lune/process")
	process.exit(1)
end
