--!strict
-- Polaires de vitesse + calcul des angles optimaux (meilleur VMG au près / au portant).

local BoatClasses = require(script.Parent.BoatClasses)
local Sails = require(script.Parent.Sails)
local Angles = require(script.Parent.Parent.Util.Angles)

type BoatClass = BoatClasses.BoatClass

export type Entitlements = {
	foils: boolean,
	sailPack: boolean,
	proWinches: boolean,
	autoSail: boolean,
}

local Polars = {}

Polars.NO_OPTIONS = table.freeze({ foils = false, sailPack = false, proWinches = false, autoSail = false })

-- Ratio de forme (interpolation linéaire des nœuds).
function Polars.shape(boat: BoatClass, twaAbs: number): number
	local nodes = boat.nodes
	if twaAbs <= nodes[1][1] then
		return nodes[1][2]
	end
	for i = 2, #nodes do
		local a, b = nodes[i - 1], nodes[i]
		if twaAbs <= b[1] then
			local t = (twaAbs - a[1]) / (b[1] - a[1])
			return a[2] + (b[2] - a[2]) * t
		end
	end
	return nodes[#nodes][2]
end

-- Effet de la force du vent sur la vitesse de coque.
function Polars.windFactor(boat: BoatClass, tws: number): number
	local f = 1 - math.exp(-tws / boat.k)
	if tws > 30 then
		f *= math.max(0.7, 1 - (tws - 30) * 0.012) -- mer forte : on lève le pied
	end
	return f
end

-- Facteur foils (1 = pas d'effet). Renvoie aussi si le bateau "vole".
function Polars.foilFactor(boat: BoatClass, ent: Entitlements, twaAbs: number, tws: number): (number, boolean)
	local spec = boat.foil
	local hasFoils = boat.foilsBuiltIn or (boat.foilCapable and ent.foils)
	if not spec or not hasFoils then
		return 1, false
	end
	local a = Angles.smoothstep(spec.twaLo - 8, spec.twaLo + 8, twaAbs)
		* (1 - Angles.smoothstep(spec.twaHi - 8, spec.twaHi + 8, twaAbs))
	local w = Angles.smoothstep(spec.twsMin - 2, spec.twsMin + 3, tws)
	local lift = a * w
	local factor = 1 + spec.bonus * lift
	if boat.foilsBuiltIn then
		-- Un foiler pur est lent tant qu'il ne vole pas.
		factor *= boat.offFoilPenalty + (1 - boat.offFoilPenalty) * lift
	end
	return factor, lift > 0.5
end

-- Vitesse polaire avec une voile donnée.
function Polars.speedWithSail(
	boat: BoatClass,
	ent: Entitlements,
	sail: Sails.Sail,
	twaAbs: number,
	tws: number
): (number, boolean)
	local base = boat.vmax * Polars.windFactor(boat, tws) * Polars.shape(boat, twaAbs)
	local foil, flying = Polars.foilFactor(boat, ent, twaAbs, tws)
	return base * Sails.efficiency(sail, twaAbs, tws) * foil, flying
end

-- Vitesse avec la meilleure voile disponible.
function Polars.bestSpeed(
	boat: BoatClass,
	ent: Entitlements,
	twaAbs: number,
	tws: number
): (number, Sails.Sail)
	local sail = Sails.best(twaAbs, tws, ent.sailPack)
	local v = Polars.speedWithSail(boat, ent, sail, twaAbs, tws)
	return v, sail
end

-- Cache des angles optimaux, clé = bateau|options|vent arrondi|près/portant.
local vmgCache: { [string]: number } = {}

local function entKey(ent: Entitlements): string
	return (if ent.foils then "F" else "-") .. (if ent.sailPack then "S" else "-")
end

-- |TWA| qui maximise la VMG (vitesse projetée face au vent ou vent arrière).
function Polars.bestVmgTwa(boat: BoatClass, ent: Entitlements, tws: number, upwind: boolean): number
	local twsR = math.floor(tws * 2 + 0.5) / 2
	local key = boat.id .. entKey(ent) .. tostring(twsR) .. (if upwind then "U" else "D")
	local cached = vmgCache[key]
	if cached then
		return cached
	end
	local bestTwa, bestVmg = if upwind then 45 else 150, -math.huge
	local lo, hi = if upwind then 25 else 90, if upwind then 90 else 180
	for twa = lo, hi, 0.5 do
		local v = Polars.bestSpeed(boat, ent, twa, twsR)
		local vmg = v * math.cos(math.rad(twa))
		if not upwind then
			vmg = -vmg
		end
		if vmg > bestVmg then
			bestVmg, bestTwa = vmg, twa
		end
	end
	vmgCache[key] = bestTwa
	return bestTwa
end

return Polars
