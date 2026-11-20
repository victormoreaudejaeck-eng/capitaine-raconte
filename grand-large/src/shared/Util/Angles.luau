--!strict
-- Angles en degrés. Convention du jeu (plan 2D "carte") :
--   x = est, y = nord.  Cap 0° = nord, 90° = est (sens horaire, comme une boussole).
--   Monde Roblox : X = x, Z = -y.
-- Vent : direction D'OÙ il vient (TWD, convention météo/marine).
-- TWA signé = TWD - cap  (positif = vent venant de tribord).

local Angles = {}

function Angles.wrap360(a: number): number
	return a % 360
end

function Angles.wrap180(a: number): number
	return (a + 180) % 360 - 180
end

-- Plus petit angle signé pour aller de `from` à `to`.
function Angles.diff(from: number, to: number): number
	return Angles.wrap180(to - from)
end

-- Vecteur unitaire (x, y) d'un cap.
function Angles.dir(heading: number): (number, number)
	local r = math.rad(heading)
	return math.sin(r), math.cos(r)
end

-- Cap pour aller de (x1, y1) vers (x2, y2).
function Angles.bearing(x1: number, y1: number, x2: number, y2: number): number
	return Angles.wrap360(math.deg(math.atan2(x2 - x1, y2 - y1)))
end

function Angles.twa(twd: number, heading: number): number
	return Angles.wrap180(twd - heading)
end

function Angles.headingFromTwa(twd: number, twa: number): number
	return Angles.wrap360(twd - twa)
end

function Angles.sign(v: number): number
	if v > 0 then
		return 1
	elseif v < 0 then
		return -1
	end
	return 0
end

function Angles.clamp(v: number, lo: number, hi: number): number
	if v < lo then
		return lo
	elseif v > hi then
		return hi
	end
	return v
end

function Angles.lerp(a: number, b: number, t: number): number
	return a + (b - a) * t
end

-- Rampe douce 0 → 1 entre lo et hi.
function Angles.smoothstep(lo: number, hi: number, v: number): number
	if hi == lo then
		return if v >= hi then 1 else 0
	end
	local t = Angles.clamp((v - lo) / (hi - lo), 0, 1)
	return t * t * (3 - 2 * t)
end

function Angles.isFinite(v: number): boolean
	return v == v and v ~= math.huge and v ~= -math.huge
end

return Angles
