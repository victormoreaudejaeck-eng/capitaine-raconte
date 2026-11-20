--!strict
-- Compile un parcours (repère vent) en portes de passage (repère carte) et
-- teste les franchissements. Tout est un SEGMENT à franchir dans un sens donné :
--   - ligne de départ / arrivée : entre deux bouées
--   - porte : entre deux bouées
--   - bouée simple : demi-droite partant de la bouée, du côté où le bateau doit
--     passer (bâbord = bouée laissée à gauche → on passe à sa droite).

local Courses = require(script.Parent.Courses)
local Geometry = require(script.Parent.Parent.Util.Geometry)
local Angles = require(script.Parent.Parent.Util.Angles)

export type Buoy = { x: number, y: number, role: string } -- role: "pin" | "committee" | "mark" | "gate"

export type Checkpoint = {
	index: number,
	kind: "start" | "mark" | "gate" | "finish",
	label: string,
	ax: number,
	ay: number,
	bx: number,
	by: number,
	sign: number, -- sens de franchissement requis (+1/-1), 0 = indifférent
	aimX: number, -- point visé (bots, flèche du HUD)
	aimY: number,
	buoys: { Buoy },
}

local Checkpoints = {}

local MARK_RAY = 650 -- longueur de la demi-droite de passage d'une bouée
local MARK_AIM = 45 -- on vise à cette distance de la bouée

local function center(p: Courses.PointDef): (number, number)
	return p.x, p.y
end

-- origin : (ox, oy) carte, twd : rotation (le "haut" du repère vent pointe vers le vent).
function Checkpoints.compile(course: Courses.Course, ox: number, oy: number, twd: number): { Checkpoint }
	local function toMap(x: number, y: number): (number, number)
		local rx, ry = Geometry.rotate(x, y, twd)
		return ox + rx, oy + ry
	end

	local out: { Checkpoint } = {}
	local pts = course.points
	for i, p in pts do
		-- Direction d'arrivée sur ce point (repère vent).
		local px, py
		if i == 1 then
			px, py = p.x, p.y - 400 -- on arrive au départ par-dessous (zone de pré-départ)
		else
			px, py = center(pts[i - 1])
		end
		local dxw, dyw = Geometry.normalize(p.x - px, p.y - py)
		if dxw == 0 and dyw == 0 then
			dxw, dyw = 0, 1
		end

		local cp: Checkpoint
		if p.kind == "mark" then
			local m = p :: Courses.MarkDef
			-- côté de passage : droite de la trajectoire pour bâbord, gauche pour tribord
			local rx, ry
			if m.side == "port" then
				rx, ry = dyw, -dxw
			else
				rx, ry = -dyw, dxw
			end
			local ax, ay = toMap(m.x, m.y)
			local bx, by = toMap(m.x + rx * MARK_RAY, m.y + ry * MARK_RAY)
			local aimX, aimY = toMap(m.x + rx * MARK_AIM, m.y + ry * MARK_AIM)
			cp = {
				index = i,
				kind = "mark",
				label = m.name,
				ax = ax,
				ay = ay,
				bx = bx,
				by = by,
				sign = 0,
				aimX = aimX,
				aimY = aimY,
				buoys = { { x = ax, y = ay, role = "mark" } },
			}
		else
			local l = p :: any
			local half = l.width / 2
			-- segment perpendiculaire à la direction d'arrivée
			local nx, ny = -dyw, dxw -- gauche
			local ax, ay = toMap(l.x + nx * half, l.y + ny * half)
			local bx, by = toMap(l.x - nx * half, l.y - ny * half)
			local aimX, aimY = toMap(l.x, l.y)
			local kind = l.kind :: any
			local roleA = if kind == "gate" then "gate" else "pin"
			local roleB = if kind == "gate" then "gate" else "committee"
			cp = {
				index = i,
				kind = kind,
				label = if kind == "gate" then l.name else "",
				ax = ax,
				ay = ay,
				bx = bx,
				by = by,
				sign = 0,
				aimX = aimX,
				aimY = aimY,
				buoys = { { x = ax, y = ay, role = roleA }, { x = bx, y = by, role = roleB } },
			}
		end
		-- Sens requis : celui de la trajectoire d'arrivée (l'arrivée est acceptée dans les deux sens).
		local tdx, tdy = Geometry.rotate(dxw, dyw, twd)
		local s = Geometry.cross(cp.bx - cp.ax, cp.by - cp.ay, tdx, tdy)
		cp.sign = if cp.kind == "finish" then 0 else Angles.sign(s)
		table.insert(out, cp)
	end
	return out
end

-- Le déplacement (x0,y0)→(x1,y1) franchit-il ce checkpoint ? Renvoie +1 (bon sens), -1 (sens inverse) ou 0.
function Checkpoints.crossing(cp: Checkpoint, x0: number, y0: number, x1: number, y1: number): number
	if not Geometry.segmentsIntersect(x0, y0, x1, y1, cp.ax, cp.ay, cp.bx, cp.by) then
		return 0
	end
	if cp.sign == 0 then
		return 1
	end
	local s = Geometry.cross(cp.bx - cp.ax, cp.by - cp.ay, x1 - x0, y1 - y0)
	return if Angles.sign(s) == cp.sign then 1 else -1
end

-- Le point est-il du côté "parcours" de la ligne de départ (prolongée) ?
function Checkpoints.onCourseSide(cp: Checkpoint, x: number, y: number): boolean
	local s = Geometry.side(x, y, cp.ax, cp.ay, cp.bx, cp.by)
	-- franchir dans le bon sens amène du côté dont le signe vaut cp.sign
	return Angles.sign(s) == cp.sign
end

-- Distance restante approximative jusqu'à l'arrivée (pour le classement en direct).
function Checkpoints.remaining(cps: { Checkpoint }, nextIndex: number, x: number, y: number): number
	if nextIndex > #cps then
		return 0
	end
	local cp = cps[nextIndex]
	local d = Geometry.distance(x, y, cp.aimX, cp.aimY)
	for i = nextIndex + 1, #cps do
		local a, b = cps[i - 1], cps[i]
		d += Geometry.distance(a.aimX, a.aimY, b.aimX, b.aimY)
	end
	return d
end

return Checkpoints
