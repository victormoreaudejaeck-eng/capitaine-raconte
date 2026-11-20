--!strict
-- Parcours, définis dans le REPÈRE DU VENT : x = travers, y = vers le vent (au vent).
-- Le serveur les tourne selon la direction du vent du jour, donc la première
-- bouée est toujours "au vent", comme sur un vrai parcours de régate.

export type MarkDef = { kind: "mark", x: number, y: number, side: "port" | "starboard", name: string }
export type GateDef = { kind: "gate", x: number, y: number, width: number, name: string }
export type LineDef = { kind: "start" | "finish", x: number, y: number, width: number }
export type PointDef = MarkDef | GateDef | LineDef

export type Course = {
	id: string,
	nameKey: string,
	allowOptions: boolean, -- false = course "Fair Play" (options désactivées)
	twsRange: { number }, -- {min, max}
	shiftAmp: number,
	gustAmp: number,
	points: { PointDef },
	weight: number, -- fréquence de tirage
}

local COURSES: { Course } = {
	{
		id = "BANANA",
		nameKey = "course_BANANA",
		allowOptions = true,
		twsRange = { 9, 20 },
		shiftAmp = 9,
		gustAmp = 0.22,
		weight = 3,
		points = {
			{ kind = "start", x = 0, y = 0, width = 340 },
			{ kind = "mark", x = 0, y = 1900, side = "port", name = "1" },
			{ kind = "gate", x = 0, y = 220, width = 140, name = "2" },
			{ kind = "mark", x = 0, y = 1900, side = "port", name = "1" },
			{ kind = "finish", x = 0, y = 120, width = 260 },
		},
	},
	{
		id = "TRIANGLE",
		nameKey = "course_TRIANGLE",
		allowOptions = true,
		twsRange = { 10, 24 },
		shiftAmp = 8,
		gustAmp = 0.25,
		weight = 3,
		points = {
			{ kind = "start", x = 0, y = 0, width = 340 },
			{ kind = "mark", x = 0, y = 1800, side = "port", name = "1" },
			{ kind = "mark", x = 1400, y = 900, side = "port", name = "2" },
			{ kind = "mark", x = 0, y = 150, side = "port", name = "3" },
			{ kind = "mark", x = 0, y = 1800, side = "port", name = "1" },
			{ kind = "finish", x = 0, y = 260, width = 260 },
		},
	},
	{
		id = "COASTAL",
		nameKey = "course_COASTAL",
		allowOptions = true,
		twsRange = { 12, 28 },
		shiftAmp = 14,
		gustAmp = 0.3,
		weight = 2,
		points = {
			{ kind = "start", x = 0, y = 0, width = 380 },
			{ kind = "mark", x = -900, y = 2200, side = "starboard", name = "A" },
			{ kind = "mark", x = 1500, y = 2600, side = "starboard", name = "B" },
			{ kind = "mark", x = 2100, y = 300, side = "starboard", name = "C" },
			{ kind = "gate", x = 300, y = -200, width = 160, name = "D" },
			{ kind = "finish", x = -200, y = 900, width = 280 },
		},
	},
	{
		id = "FAIRPLAY",
		nameKey = "course_FAIRPLAY",
		allowOptions = false,
		twsRange = { 8, 18 },
		shiftAmp = 10,
		gustAmp = 0.2,
		weight = 2,
		points = {
			{ kind = "start", x = 0, y = 0, width = 300 },
			{ kind = "mark", x = 0, y = 1500, side = "port", name = "1" },
			{ kind = "gate", x = 0, y = 200, width = 140, name = "2" },
			{ kind = "finish", x = 0, y = 1250, width = 240 },
		},
	},
}

local BY_ID: { [string]: Course } = {}
for _, c in COURSES do
	BY_ID[c.id] = c
end

local Courses = {}
Courses.LIST = COURSES

function Courses.get(id: string): Course?
	return BY_ID[id]
end

return Courses
