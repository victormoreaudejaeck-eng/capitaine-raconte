--!strict
-- Champ de vent déterministe : f(position, temps, graine).
-- Serveur et clients calculent le même vent sans rien répliquer d'autre que la spec.
--   - bascules (shifts) lentes de direction, variables dans l'espace
--   - risées (gusts) : zones de vent plus fort qui dérivent avec le vent

local Noise = require(script.Parent.Parent.Util.Noise)
local Angles = require(script.Parent.Parent.Util.Angles)

export type WindSpec = {
	twd: number, -- direction moyenne (d'où vient le vent)
	tws: number, -- force moyenne (nœuds)
	shiftAmp: number, -- amplitude des bascules (degrés)
	shiftPeriod: number, -- secondes
	gustAmp: number, -- variation relative de force (0.25 = ±25 %)
	gustScale: number, -- taille des risées (studs)
	seed: number,
}

local Wind = {}

function Wind.sample(spec: WindSpec, x: number, y: number, t: number): (number, number)
	local seed = spec.seed
	-- Bascules : surtout temporelles, un peu spatiales (côté du plan d'eau favorisé).
	local tp = t / spec.shiftPeriod
	local shift = Noise.fbm3(tp, 0.5, 0.5, seed) * spec.shiftAmp
		+ Noise.noise3(x / 2600, y / 2600, tp * 0.6, seed + 101) * spec.shiftAmp * 0.45
	local twd = Angles.wrap360(spec.twd + shift)

	-- Risées : advectées dans le sens du vent (elles "descendent" le plan d'eau).
	local dx, dy = Angles.dir(spec.twd) -- vers où le vent VIENT
	local drift = spec.tws * 1.6 * t -- studs parcourus
	local px = x + dx * drift
	local py = y + dy * drift
	local g = Noise.fbm3(px / spec.gustScale, py / spec.gustScale, t / 90, seed + 7)
	local tws = spec.tws * (1 + spec.gustAmp * g)
	return twd, math.max(1.5, tws)
end

function Wind.isValidSpec(spec: any): boolean
	if typeof(spec) ~= "table" then
		return false
	end
	for _, k in { "twd", "tws", "shiftAmp", "shiftPeriod", "gustAmp", "gustScale", "seed" } do
		local v = spec[k]
		if typeof(v) ~= "number" or not Angles.isFinite(v) then
			return false
		end
	end
	return spec.shiftPeriod > 0 and spec.gustScale > 0
end

return Wind
