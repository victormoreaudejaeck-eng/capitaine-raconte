--!strict
-- Pilote automatique / IA des bots : tire des bords au près et au portant aux
-- angles de meilleure VMG, vire sur les lay-lines, sinon va droit au but.
-- Sert aussi au "conseiller" du HUD (angle optimal affiché au joueur).

local Angles = require(script.Parent.Parent.Util.Angles)
local Polars = require(script.Parent.Polars)
local Wind = require(script.Parent.Wind)
local BoatClasses = require(script.Parent.BoatClasses)
local Physics = require(script.Parent.Physics)

export type Memory = {
	side: number, -- bord actuel (+1 tribord amures / -1 bâbord amures)
	lastTack: number, -- temps du dernier virement
	skill: number, -- 0..1 (précision des angles)
	angleError: number, -- erreur personnelle (degrés)
	laylineMargin: number, -- dépassement de lay-line toléré (degrés)
}

local Autopilot = {}

function Autopilot.newMemory(skill: number, seedValue: number): Memory
	local e = (seedValue % 1000) / 1000 * 2 - 1
	return {
		side = 0,
		lastTack = -math.huge,
		skill = skill,
		angleError = e * (1 - skill) * 6,
		laylineMargin = 1 + (1 - skill) * 6,
	}
end

function Autopilot.helm(
	state: Physics.BoatState,
	boat: BoatClasses.BoatClass,
	ent: Polars.Entitlements,
	wind: Wind.WindSpec,
	t: number,
	tx: number,
	ty: number,
	mem: Memory
): Physics.Helm
	local twd, tws = Wind.sample(wind, state.x, state.y, t)
	local brg = Angles.bearing(state.x, state.y, tx, ty)
	local twaDirect = Angles.twa(twd, brg)
	local up = Polars.bestVmgTwa(boat, ent, tws, true) + mem.angleError
	local down = Polars.bestVmgTwa(boat, ent, tws, false) - mem.angleError
	local minGap = math.max(boat.tackTime, boat.gybeTime) * 1.6

	local helm: Physics.Helm = { mode = "heading", value = brg, sail = state.sail, autoSail = true }

	if mem.side == 0 then
		mem.side = if Angles.sign(state.twa) ~= 0 then Angles.sign(state.twa) else Angles.sign(twaDirect)
		if mem.side == 0 then
			mem.side = 1
		end
	end

	local absDirect = math.abs(twaDirect)
	if absDirect < up then
		-- Au près : on tient le bord jusqu'à ce que la bouée soit sur la lay-line de l'autre bord.
		local other = -mem.side
		if
			Angles.sign(twaDirect) == other
			and absDirect >= up - mem.laylineMargin
			and t - mem.lastTack > minGap
		then
			mem.side = other
			mem.lastTack = t
		end
		helm.mode = "twa"
		helm.value = mem.side * up
	elseif absDirect > down then
		-- Au portant : même logique avec les empannages.
		local other = -mem.side
		if
			Angles.sign(twaDirect) == other
			and absDirect <= down + mem.laylineMargin
			and t - mem.lastTack > minGap
		then
			mem.side = other
			mem.lastTack = t
		end
		helm.mode = "twa"
		helm.value = mem.side * down
	else
		-- Reaching : cap direct.
		mem.side = Angles.sign(twaDirect)
		helm.mode = "heading"
		helm.value = brg
	end
	return helm
end

-- Pour le HUD : angles optimaux dans le vent local.
function Autopilot.advice(
	boat: BoatClasses.BoatClass,
	ent: Polars.Entitlements,
	tws: number
): (number, number)
	return Polars.bestVmgTwa(boat, ent, tws, true), Polars.bestVmgTwa(boat, ent, tws, false)
end

return Autopilot
