--!strict
-- Achats en pièces et choix du bateau. Prix et conditions lus côté SERVEUR uniquement.

local Shared = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Catalog = require(Shared.Shop.Catalog)
local BoatClasses = require(Shared.Sailing.BoatClasses)
local Net = require(Shared.Net)
local DataService = require(script.Parent.DataService)
local Entitlements = require(script.Parent.Entitlements)
local RateLimit = require(script.Parent.Parent.Util.RateLimit)

local ShopService = {}

local function notify(player: Player, key: string, args: { any }?)
	Net.event("Notify"):FireClient(player, key, args)
end

local function buyWithCoins(player: Player, kind: unknown, id: unknown)
	if not RateLimit.allow(player, "BuyWithCoins", 2, 4) then
		return
	end
	if typeof(kind) ~= "string" or typeof(id) ~= "string" or #id > 32 then
		return
	end
	local profile = DataService.get(player)
	if not profile then
		return
	end
	local level = Catalog.levelFromXp(profile.xp)

	if kind == "boat" then
		local boat = BoatClasses.get(id)
		if not boat or profile.boats[id] then
			return
		end
		if level < boat.minLevel then
			notify(player, "n_level")
			return
		end
		if profile.coins < boat.priceCoins then
			notify(player, "n_not_enough")
			return
		end
		DataService.update(player, function(p)
			p.coins -= boat.priceCoins
			p.boats[id] = true
			p.selectedBoat = id
		end)
		notify(player, "n_bought", { boat.nameKey })
	elseif kind == "option" then
		local opt = Catalog.option(id)
		if not opt or opt.priceCoins == nil or Entitlements.hasOption(player, id) then
			return
		end
		local price = opt.priceCoins :: number
		if profile.coins < price then
			notify(player, "n_not_enough")
			return
		end
		DataService.update(player, function(p)
			p.coins -= price
			p.options[id] = true
		end)
		notify(player, "n_bought", { opt.nameKey })
	end
end

local function selectBoat(player: Player, id: unknown)
	if not RateLimit.allow(player, "SelectBoat", 2, 4) then
		return
	end
	if typeof(id) ~= "string" then
		return
	end
	local profile = DataService.get(player)
	if not profile or not profile.boats[id] or not BoatClasses.isValid(id) then
		return
	end
	DataService.update(player, function(p)
		p.selectedBoat = id
	end)
	local boat = BoatClasses.get(id) :: BoatClasses.BoatClass
	notify(player, "n_selected", { boat.nameKey })
end

local function setAutoJoin(player: Player, on: unknown)
	if not RateLimit.allow(player, "SetAutoJoin", 2, 3) or typeof(on) ~= "boolean" then
		return
	end
	DataService.update(player, function(p)
		p.settings.autoJoin = on
	end)
	notify(player, if on then "n_autojoin_on" else "n_autojoin_off")
end

local function buyWithRobux(player: Player, kind: unknown, id: unknown)
	if not RateLimit.allow(player, "BuyWithRobux", 1, 3) then
		return
	end
	if typeof(kind) ~= "string" or typeof(id) ~= "string" then
		return
	end
	Entitlements.promptRobux(player, kind, id)
end

function ShopService.start()
	Net.event("BuyWithCoins").OnServerEvent:Connect(buyWithCoins)
	Net.event("BuyWithRobux").OnServerEvent:Connect(buyWithRobux)
	Net.event("SelectBoat").OnServerEvent:Connect(selectBoat)
	Net.event("SetAutoJoin").OnServerEvent:Connect(setAutoJoin)
end

return ShopService
