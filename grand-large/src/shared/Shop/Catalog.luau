--!strict
-- Catalogue boutique : options (achetables en pièces OU en Robux via Game Pass),
-- bateaux (pièces) et packs de pièces (Developer Products).
--
-- ⚠️ Remplace les 0 par les vrais IDs créés sur le Creator Dashboard
--    (Monétisation → Passes / Developer Products). Tant qu'un ID vaut 0,
--    le bouton Robux correspondant est masqué.

export type OptionId = "FOILS" | "SAILPACK" | "WINCHES" | "AUTOSAIL" | "VIP"

export type Option = {
	id: OptionId,
	nameKey: string,
	descKey: string,
	priceCoins: number?, -- nil = Robux uniquement
	gamePassId: number,
	robuxHint: number, -- prix indicatif affiché (le vrai prix est celui du Dashboard)
	icon: string,
}

export type Product = {
	id: string,
	productId: number,
	coins: number,
	robuxHint: number,
}

local OPTIONS: { Option } = {
	{
		id = "FOILS",
		nameKey = "opt_FOILS",
		descKey = "optd_FOILS",
		priceCoins = 20000,
		gamePassId = 0,
		robuxHint = 249,
		icon = "🪽",
	},
	{
		id = "SAILPACK",
		nameKey = "opt_SAILPACK",
		descKey = "optd_SAILPACK",
		priceCoins = 15000,
		gamePassId = 0,
		robuxHint = 199,
		icon = "⛵",
	},
	{
		id = "WINCHES",
		nameKey = "opt_WINCHES",
		descKey = "optd_WINCHES",
		priceCoins = 8000,
		gamePassId = 0,
		robuxHint = 99,
		icon = "⚙️",
	},
	{
		id = "AUTOSAIL",
		nameKey = "opt_AUTOSAIL",
		descKey = "optd_AUTOSAIL",
		priceCoins = 5000,
		gamePassId = 0,
		robuxHint = 79,
		icon = "🤖",
	},
	{
		id = "VIP",
		nameKey = "opt_VIP",
		descKey = "optd_VIP",
		priceCoins = nil,
		gamePassId = 0,
		robuxHint = 399,
		icon = "👑",
	},
}

local PRODUCTS: { Product } = {
	{ id = "COINS_S", productId = 0, coins = 2500, robuxHint = 49 },
	{ id = "COINS_M", productId = 0, coins = 7500, robuxHint = 129 },
	{ id = "COINS_L", productId = 0, coins = 25000, robuxHint = 349 },
}

local OPT_BY_ID: { [string]: Option } = {}
for _, o in OPTIONS do
	OPT_BY_ID[o.id] = o
end
local PRODUCT_BY_ID: { [string]: Product } = {}
local PRODUCT_BY_PID: { [number]: Product } = {}
for _, p in PRODUCTS do
	PRODUCT_BY_ID[p.id] = p
	if p.productId ~= 0 then
		PRODUCT_BY_PID[p.productId] = p
	end
end

local Catalog = {}
Catalog.OPTIONS = OPTIONS
Catalog.PRODUCTS = PRODUCTS

function Catalog.option(id: string): Option?
	return OPT_BY_ID[id]
end

function Catalog.product(id: string): Product?
	return PRODUCT_BY_ID[id]
end

function Catalog.productByPurchaseId(productId: number): Product?
	return PRODUCT_BY_PID[productId]
end

-- Niveau à partir de l'XP (courbe douce).
function Catalog.levelFromXp(xp: number): number
	return math.floor(math.sqrt(math.max(0, xp) / 120)) + 1
end

function Catalog.xpForLevel(level: number): number
	return (level - 1) ^ 2 * 120
end

return Catalog
