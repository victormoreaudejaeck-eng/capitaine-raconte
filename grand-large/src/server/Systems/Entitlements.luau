--!strict
-- Droits du joueur = options achetées en pièces OU Game Pass Robux.
-- Gère aussi les achats Robux (Game Pass + Developer Products, ProcessReceipt).

local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

local Shared = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Catalog = require(Shared.Shop.Catalog)
local Net = require(Shared.Net)
local Types = require(Shared.Types)
local Polars = require(Shared.Sailing.Polars)
local DataService = require(script.Parent.DataService)

local Entitlements = {}

local passCache: { [Player]: { [string]: boolean } } = {}

local function ownsPass(player: Player, optionId: string): boolean
	local c = passCache[player]
	return c ~= nil and c[optionId] == true
end

function Entitlements.hasOption(player: Player, optionId: string): boolean
	if ownsPass(player, optionId) then
		return true
	end
	local p = DataService.get(player)
	return p ~= nil and p.options[optionId] == true
end

-- Droits de navigation pour une course (allowOptions = false → aucune option).
function Entitlements.sailing(player: Player, allowOptions: boolean): Polars.Entitlements
	if not allowOptions then
		return Polars.NO_OPTIONS
	end
	return {
		foils = Entitlements.hasOption(player, "FOILS"),
		sailPack = Entitlements.hasOption(player, "SAILPACK"),
		proWinches = Entitlements.hasOption(player, "WINCHES"),
		autoSail = Entitlements.hasOption(player, "AUTOSAIL"),
	}
end

function Entitlements.isVip(player: Player): boolean
	return Entitlements.hasOption(player, "VIP")
end

function Entitlements.publicProfile(player: Player): Types.PublicProfile?
	local p = DataService.get(player)
	if not p then
		return nil
	end
	local owned: { [string]: boolean } = {}
	local passes: { [string]: boolean } = {}
	for _, o in Catalog.OPTIONS do
		owned[o.id] = Entitlements.hasOption(player, o.id)
		passes[o.id] = o.gamePassId ~= 0
	end
	local products: { [string]: boolean } = {}
	for _, pr in Catalog.PRODUCTS do
		products[pr.id] = pr.productId ~= 0
	end
	return {
		coins = p.coins,
		xp = p.xp,
		level = Catalog.levelFromXp(p.xp),
		boats = table.clone(p.boats),
		options = owned,
		selectedBoat = p.selectedBoat,
		stats = p.stats,
		autoJoin = p.settings.autoJoin,
		gamePassesEnabled = passes,
		productsEnabled = products,
	}
end

function Entitlements.push(player: Player)
	local view = Entitlements.publicProfile(player)
	if view then
		Net.event("Profile"):FireClient(player, view)
	end
end

local function refreshPasses(player: Player)
	local cache: { [string]: boolean } = {}
	for _, o in Catalog.OPTIONS do
		if o.gamePassId ~= 0 then
			local ok, owns = pcall(function()
				return MarketplaceService:UserOwnsGamePassAsync(player.UserId, o.gamePassId)
			end)
			cache[o.id] = ok and owns == true
		end
	end
	passCache[player] = cache
end

local function processReceipt(info: any): Enum.ProductPurchaseDecision
	local player = Players:GetPlayerByUserId(info.PlayerId)
	if not player then
		return Enum.ProductPurchaseDecision.NotProcessedYet
	end
	local profile = DataService.get(player)
	if not profile then
		return Enum.ProductPurchaseDecision.NotProcessedYet
	end
	local purchaseId = tostring(info.PurchaseId)
	if DataService.hasReceipt(player, purchaseId) then
		return Enum.ProductPurchaseDecision.PurchaseGranted
	end
	local product = Catalog.productByPurchaseId(info.ProductId)
	if not product then
		warn("[Entitlements] produit inconnu " .. tostring(info.ProductId))
		return Enum.ProductPurchaseDecision.NotProcessedYet
	end
	DataService.update(player, function(p)
		p.coins += product.coins
		DataService.addReceipt(p, purchaseId)
	end)
	if not DataService.saveNow(player) then
		-- reçu déjà noté en mémoire : le prochain appel répondra PurchaseGranted sans doubler
		return Enum.ProductPurchaseDecision.NotProcessedYet
	end
	Net.event("Notify"):FireClient(player, "n_bought", { "+" .. tostring(product.coins) .. " 🪙" })
	return Enum.ProductPurchaseDecision.PurchaseGranted
end

function Entitlements.promptRobux(player: Player, kind: string, id: string)
	if kind == "option" then
		local o = Catalog.option(id)
		if o and o.gamePassId ~= 0 and not ownsPass(player, id) then
			MarketplaceService:PromptGamePassPurchase(player, o.gamePassId)
		end
	elseif kind == "product" then
		local pr = Catalog.product(id)
		if pr and pr.productId ~= 0 then
			MarketplaceService:PromptProductPurchase(player, pr.productId)
		end
	end
end

function Entitlements.init()
	MarketplaceService.ProcessReceipt = processReceipt
end

function Entitlements.start()
	DataService.Loaded:Connect(function(player)
		refreshPasses(player)
		Entitlements.push(player)
	end)
	DataService.Changed:Connect(function(player)
		Entitlements.push(player)
	end)
	MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player, passId, purchased)
		if not purchased then
			return
		end
		for _, o in Catalog.OPTIONS do
			if o.gamePassId == passId then
				local c = passCache[player] or {}
				c[o.id] = true
				passCache[player] = c
				Net.event("Notify"):FireClient(player, "n_bought", { o.nameKey })
			end
		end
		Entitlements.push(player)
	end)
	Players.PlayerRemoving:Connect(function(player)
		passCache[player] = nil
	end)
end

return Entitlements
