--!strict
-- Géométrie 2D pure (plan carte x/y).

local Geometry = {}

function Geometry.cross(ax: number, ay: number, bx: number, by: number): number
	return ax * by - ay * bx
end

-- Le déplacement p0→p1 coupe-t-il le segment a→b ?
function Geometry.segmentsIntersect(
	p0x: number,
	p0y: number,
	p1x: number,
	p1y: number,
	ax: number,
	ay: number,
	bx: number,
	by: number
): boolean
	local rx, ry = p1x - p0x, p1y - p0y
	local sx, sy = bx - ax, by - ay
	local denom = Geometry.cross(rx, ry, sx, sy)
	if math.abs(denom) < 1e-9 then
		return false
	end
	local qpx, qpy = ax - p0x, ay - p0y
	local t = Geometry.cross(qpx, qpy, sx, sy) / denom
	local u = Geometry.cross(qpx, qpy, rx, ry) / denom
	return t >= 0 and t <= 1 and u >= 0 and u <= 1
end

-- Côté du point p par rapport à la droite a→b : >0 à gauche, <0 à droite.
function Geometry.side(px: number, py: number, ax: number, ay: number, bx: number, by: number): number
	return Geometry.cross(bx - ax, by - ay, px - ax, py - ay)
end

function Geometry.distance(ax: number, ay: number, bx: number, by: number): number
	local dx, dy = bx - ax, by - ay
	return math.sqrt(dx * dx + dy * dy)
end

-- Distance d'un point à un segment.
function Geometry.distanceToSegment(
	px: number,
	py: number,
	ax: number,
	ay: number,
	bx: number,
	by: number
): number
	local sx, sy = bx - ax, by - ay
	local len2 = sx * sx + sy * sy
	if len2 < 1e-9 then
		return Geometry.distance(px, py, ax, ay)
	end
	local t = math.clamp(((px - ax) * sx + (py - ay) * sy) / len2, 0, 1)
	return Geometry.distance(px, py, ax + sx * t, ay + sy * t)
end

function Geometry.normalize(x: number, y: number): (number, number)
	local l = math.sqrt(x * x + y * y)
	if l < 1e-9 then
		return 0, 0
	end
	return x / l, y / l
end

-- Rotation d'un vecteur (repère "vent" → carte) : angle en degrés, sens horaire (cap).
function Geometry.rotate(x: number, y: number, headingDeg: number): (number, number)
	local r = math.rad(headingDeg)
	local c, s = math.cos(r), math.sin(r)
	-- (0,1) devient le vecteur du cap headingDeg
	return x * c + y * s, -x * s + y * c
end

return Geometry
