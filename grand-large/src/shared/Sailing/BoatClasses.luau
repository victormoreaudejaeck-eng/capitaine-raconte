--!strict
-- Classes de bateaux (designs originaux). Chaque classe a sa polaire :
--   vitesse = vmax × (1 − e^(−TWS/k)) × ratio(|TWA|)
-- `nodes` décrit la forme de la polaire (ratio selon l'angle au vent).

export type PolarNode = { number } -- { twa, ratio }

export type FoilSpec = {
	twaLo: number, -- début de la plage d'angles où les foils portent
	twaHi: number,
	twsMin: number, -- vent minimum pour décoller
	bonus: number, -- gain de vitesse max (0.12 = +12 %)
}

export type BoatClass = {
	id: string,
	nameKey: string,
	descKey: string,
	style: "dinghy" | "mono" | "monoFoil" | "trimaran" | "foilCat",
	order: number,
	length: number, -- longueur visuelle en studs
	vmax: number, -- nœuds
	k: number, -- vent de saturation
	nodes: { PolarNode },
	turnRate: number, -- degrés / seconde
	accel: number, -- nœuds / seconde
	decel: number,
	tackTime: number, -- secondes de pénalité
	gybeTime: number,
	sailChangeTime: number,
	foilCapable: boolean, -- peut recevoir l'option Foils
	foilsBuiltIn: boolean, -- foils de série (catamaran volant)
	foil: FoilSpec?,
	offFoilPenalty: number, -- facteur si un "foiler pur" ne vole pas
	tcf: number, -- coefficient de handicap (temps compensé = temps réel × tcf)
	coinMultiplier: number, -- les gros bateaux rapportent plus
	priceCoins: number, -- 0 = gratuit
	minLevel: number,
}

local CLASSES: { BoatClass } = {
	{
		id = "DINGHY",
		nameKey = "boat_DINGHY",
		descKey = "boatd_DINGHY",
		style = "dinghy",
		order = 1,
		length = 14,
		vmax = 9.5,
		k = 9,
		nodes = {
			{ 0, 0 },
			{ 30, 0 },
			{ 37, 0.3 },
			{ 45, 0.7 },
			{ 60, 0.84 },
			{ 90, 0.97 },
			{ 110, 1 },
			{ 135, 0.95 },
			{ 150, 0.88 },
			{ 180, 0.78 },
		},
		turnRate = 40,
		accel = 2.4,
		decel = 2.0,
		tackTime = 2.5,
		gybeTime = 2.5,
		sailChangeTime = 3,
		foilCapable = false,
		foilsBuiltIn = false,
		foil = nil,
		offFoilPenalty = 1,
		tcf = 1.00,
		coinMultiplier = 1.0,
		priceCoins = 0,
		minLevel = 1,
	},
	{
		id = "OCEAN40",
		nameKey = "boat_OCEAN40",
		descKey = "boatd_OCEAN40",
		style = "mono",
		order = 2,
		length = 26,
		vmax = 17,
		k = 11,
		nodes = {
			{ 0, 0 },
			{ 28, 0 },
			{ 36, 0.32 },
			{ 42, 0.62 },
			{ 55, 0.76 },
			{ 75, 0.9 },
			{ 100, 0.99 },
			{ 120, 1 },
			{ 140, 0.95 },
			{ 160, 0.84 },
			{ 180, 0.74 },
		},
		turnRate = 20,
		accel = 1.0,
		decel = 1.1,
		tackTime = 5,
		gybeTime = 5,
		sailChangeTime = 7,
		foilCapable = false,
		foilsBuiltIn = false,
		foil = nil,
		offFoilPenalty = 1,
		tcf = 1.44,
		coinMultiplier = 1.15,
		priceCoins = 2500,
		minLevel = 2,
	},
	{
		id = "OCEAN60",
		nameKey = "boat_OCEAN60",
		descKey = "boatd_OCEAN60",
		style = "monoFoil",
		order = 3,
		length = 36,
		vmax = 22,
		k = 12,
		nodes = {
			{ 0, 0 },
			{ 28, 0 },
			{ 36, 0.3 },
			{ 42, 0.58 },
			{ 55, 0.72 },
			{ 75, 0.88 },
			{ 95, 0.98 },
			{ 115, 1 },
			{ 135, 0.96 },
			{ 155, 0.84 },
			{ 180, 0.7 },
		},
		turnRate = 16,
		accel = 0.85,
		decel = 1.0,
		tackTime = 7,
		gybeTime = 7,
		sailChangeTime = 9,
		foilCapable = true,
		foilsBuiltIn = false,
		foil = { twaLo = 65, twaHi = 165, twsMin = 11, bonus = 0.14 },
		offFoilPenalty = 1,
		tcf = 1.64,
		coinMultiplier = 1.3,
		priceCoins = 9000,
		minLevel = 4,
	},
	{
		id = "TRIMARAN",
		nameKey = "boat_TRIMARAN",
		descKey = "boatd_TRIMARAN",
		style = "trimaran",
		order = 4,
		length = 50,
		vmax = 33,
		k = 13,
		nodes = {
			{ 0, 0 },
			{ 30, 0 },
			{ 38, 0.3 },
			{ 45, 0.56 },
			{ 60, 0.74 },
			{ 80, 0.9 },
			{ 105, 1 },
			{ 130, 0.98 },
			{ 145, 0.9 },
			{ 165, 0.7 },
			{ 180, 0.58 },
		},
		turnRate = 11,
		accel = 0.75,
		decel = 1.0,
		tackTime = 12,
		gybeTime = 9,
		sailChangeTime = 11,
		foilCapable = true,
		foilsBuiltIn = false,
		foil = { twaLo = 60, twaHi = 160, twsMin = 12, bonus = 0.11 },
		offFoilPenalty = 1,
		tcf = 1.98,
		coinMultiplier = 1.5,
		priceCoins = 28000,
		minLevel = 8,
	},
	{
		id = "FOILCAT",
		nameKey = "boat_FOILCAT",
		descKey = "boatd_FOILCAT",
		style = "foilCat",
		order = 5,
		length = 30,
		vmax = 27,
		k = 9,
		nodes = {
			{ 0, 0 },
			{ 32, 0 },
			{ 40, 0.35 },
			{ 48, 0.66 },
			{ 65, 0.86 },
			{ 90, 0.97 },
			{ 115, 1 },
			{ 135, 0.97 },
			{ 150, 0.86 },
			{ 170, 0.64 },
			{ 180, 0.55 },
		},
		turnRate = 26,
		accel = 1.8,
		decel = 2.4,
		tackTime = 4.5,
		gybeTime = 3.5,
		sailChangeTime = 5,
		foilCapable = true,
		foilsBuiltIn = true,
		foil = { twaLo = 42, twaHi = 165, twsMin = 8, bonus = 0.42 },
		offFoilPenalty = 0.7, -- sans voler, ce bateau est lent
		tcf = 3.20,
		coinMultiplier = 1.4,
		priceCoins = 18000,
		minLevel = 6,
	},
}

local BY_ID: { [string]: BoatClass } = {}
for _, c in CLASSES do
	BY_ID[c.id] = c
end

local BoatClasses = {}
BoatClasses.LIST = CLASSES
BoatClasses.DEFAULT = "DINGHY"

function BoatClasses.get(id: string): BoatClass?
	return BY_ID[id]
end

function BoatClasses.isValid(id: unknown): boolean
	return typeof(id) == "string" and BY_ID[id] ~= nil
end

return BoatClasses
