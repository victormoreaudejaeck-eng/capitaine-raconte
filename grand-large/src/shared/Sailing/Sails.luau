--!strict
-- Garde-robe de voiles. Chaque voile a une zone idéale (angle au vent TWA,
-- force du vent TWS) où elle rend 100 %. En dehors, son rendement baisse.
-- Les voiles "de base" sont gratuites ; le Pack Voiles débloque les autres.

local Sails = {}

export type SailId = "JIB" | "SPI" | "C0" | "LJ" | "STAY" | "LG" | "HG"

export type Sail = {
	id: SailId,
	key: string, -- clé de texte (Strings)
	short: string,
	color: { number }, -- RGB 0-255 pour le rendu
	twaLo: number,
	twaHi: number,
	twsLo: number,
	twsHi: number,
	falloffTwa: number, -- perte par degré hors zone
	falloffTws: number, -- perte par nœud hors zone
	basic: boolean,
	downwind: boolean, -- voile d'avant portante (rendu : gonflée devant)
}

local LIST: { Sail } = {
	{
		id = "JIB",
		key = "sail_JIB",
		short = "FOC",
		color = { 245, 245, 240 },
		twaLo = 0,
		twaHi = 92,
		twsLo = 7,
		twsHi = 23,
		falloffTwa = 0.0045,
		falloffTws = 0.009,
		basic = true,
		downwind = false,
	},
	{
		id = "SPI",
		key = "sail_SPI",
		short = "SPI",
		color = { 230, 60, 60 },
		twaLo = 118,
		twaHi = 180,
		twsLo = 4,
		twsHi = 20,
		falloffTwa = 0.006,
		falloffTws = 0.008,
		basic = true,
		downwind = true,
	},
	{
		id = "C0",
		key = "sail_C0",
		short = "C0",
		color = { 255, 200, 60 },
		twaLo = 62,
		twaHi = 118,
		twsLo = 0,
		twsHi = 16,
		falloffTwa = 0.006,
		falloffTws = 0.01,
		basic = false,
		downwind = true,
	},
	{
		id = "LJ",
		key = "sail_LJ",
		short = "FL",
		color = { 200, 230, 255 },
		twaLo = 0,
		twaHi = 88,
		twsLo = 0,
		twsHi = 9,
		falloffTwa = 0.005,
		falloffTws = 0.012,
		basic = false,
		downwind = false,
	},
	{
		id = "STAY",
		key = "sail_STAY",
		short = "TRQ",
		color = { 90, 90, 100 },
		twaLo = 0,
		twaHi = 98,
		twsLo = 22,
		twsHi = 70,
		falloffTwa = 0.005,
		falloffTws = 0.01,
		basic = false,
		downwind = false,
	},
	{
		id = "LG",
		key = "sail_LG",
		short = "GL",
		color = { 80, 170, 255 },
		twaLo = 100,
		twaHi = 165,
		twsLo = 0,
		twsHi = 12,
		falloffTwa = 0.006,
		falloffTws = 0.01,
		basic = false,
		downwind = true,
	},
	{
		id = "HG",
		key = "sail_HG",
		short = "GH",
		color = { 40, 60, 160 },
		twaLo = 95,
		twaHi = 170,
		twsLo = 19,
		twsHi = 70,
		falloffTwa = 0.006,
		falloffTws = 0.01,
		basic = false,
		downwind = true,
	},
}

local BY_ID: { [string]: Sail } = {}
for _, s in LIST do
	BY_ID[s.id] = s
end

Sails.LIST = LIST
Sails.DEFAULT = "JIB" :: SailId

function Sails.get(id: string): Sail?
	return BY_ID[id]
end

function Sails.isValid(id: unknown): boolean
	return typeof(id) == "string" and BY_ID[id] ~= nil
end

-- Rendement d'une voile pour |TWA| et TWS donnés, entre ~0.35 et 1.
function Sails.efficiency(sail: Sail, twaAbs: number, tws: number): number
	local dA = math.max(0, sail.twaLo - twaAbs, twaAbs - sail.twaHi)
	local dW = math.max(0, sail.twsLo - tws, tws - sail.twsHi)
	local eff = 1 - sail.falloffTwa * dA - sail.falloffTws * dW
	-- Une voile portante ne sert à rien au près.
	if sail.downwind and twaAbs < 55 then
		eff = math.min(eff, 0.45)
	end
	return math.max(0.35, eff)
end

function Sails.canUse(sail: Sail, hasSailPack: boolean): boolean
	return sail.basic or hasSailPack
end

-- Meilleure voile disponible pour ces conditions.
function Sails.best(twaAbs: number, tws: number, hasSailPack: boolean): (Sail, number)
	local best, bestEff = BY_ID.JIB, -1
	for _, s in LIST do
		if Sails.canUse(s, hasSailPack) then
			local e = Sails.efficiency(s, twaAbs, tws)
			if e > bestEff + 1e-6 then
				best, bestEff = s, e
			end
		end
	end
	return best, bestEff
end

return Sails
