--!strict
-- Boutique : bateaux (pièces), options (pièces OU Robux), packs de pièces (Robux).
-- Le client ne fait que DEMANDER ; le serveur vérifie prix, niveau et solde.

local Players = game:GetService("Players")

local Shared = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Net = require(Shared.Net)
local Strings = require(Shared.Strings)
local Catalog = require(Shared.Shop.Catalog)
local BoatClasses = require(Shared.Sailing.BoatClasses)
local Ui = require(script.Parent.Parent.Ui.Ui)
local RaceClient = require(script.Parent.RaceClient)
local Hud = require(script.Parent.Hud)

local T = Ui.Theme
local L = Strings.get

local Shop = {}

local gui: ScreenGui
local window: Frame
local content: ScrollingFrame
local tab: "boats" | "options" | "coins" = "boats"
local tabButtons: { [string]: TextButton } = {}

local function clear()
	for _, c in content:GetChildren() do
		if c:IsA("GuiObject") then
			c:Destroy()
		end
	end
end

local function card(order: number, title: string, desc: string, extra: string?): (Frame, Frame)
	local f = Ui.panel({
		Size = UDim2.new(1, -8, 0, 96),
		BackgroundColor3 = T.panel2,
		LayoutOrder = order,
		Parent = content,
	})
	Ui.label({
		Size = UDim2.new(0.62, 0, 0, 26),
		Position = UDim2.fromOffset(12, 8),
		Text = title,
		TextSize = 20,
		Font = Enum.Font.GothamBlack,
		TextXAlignment = Enum.TextXAlignment.Left,
		Parent = f,
	})
	Ui.label({
		Size = UDim2.new(0.62, 0, 0, 36),
		Position = UDim2.fromOffset(12, 34),
		Text = desc,
		TextSize = 13,
		TextColor3 = T.dim,
		TextWrapped = true,
		TextXAlignment = Enum.TextXAlignment.Left,
		TextYAlignment = Enum.TextYAlignment.Top,
		Parent = f,
	})
	if extra then
		Ui.label({
			Size = UDim2.new(0.62, 0, 0, 18),
			Position = UDim2.fromOffset(12, 72),
			Text = extra,
			TextSize = 12,
			TextColor3 = T.accent,
			TextXAlignment = Enum.TextXAlignment.Left,
			Parent = f,
		})
	end
	local actions = Ui.new("Frame", {
		Size = UDim2.new(0.36, -12, 1, -16),
		Position = UDim2.new(0.64, 0, 0, 8),
		BackgroundTransparency = 1,
		Parent = f,
	})
	Ui.list(Enum.FillDirection.Vertical, 6, Enum.HorizontalAlignment.Right).Parent = actions
	return f, actions
end

local function action(parent: Frame, text: string, color: Color3, enabled: boolean, onClick: (() -> ())?)
	local b = Ui.button({
		Size = UDim2.new(1, 0, 0, 36),
		Text = text,
		TextSize = 15,
		BackgroundColor3 = if enabled then color else Color3.fromRGB(50, 55, 65),
		AutoButtonColor = enabled,
	}, if enabled then onClick else nil)
	b.Parent = parent
end

local function renderBoats(p: any)
	for _, boat in BoatClasses.LIST do
		local extra = string.format(
			"Vmax ~%d kn%s",
			math.floor(boat.vmax * (if boat.foilsBuiltIn then 1 + (boat.foil :: any).bonus else 1)),
			if boat.foilCapable and not boat.foilsBuiltIn then " · Foils ✓" else ""
		)
		local _, actions = card(boat.order, L(boat.nameKey), L(boat.descKey), extra)
		if p.boats[boat.id] then
			if p.selectedBoat == boat.id then
				action(actions, "✓ " .. L("shop_selected"), T.good, false)
			else
				action(actions, L("shop_select"), T.accent, true, function()
					Net.event("SelectBoat"):FireServer(boat.id)
				end)
			end
		elseif p.level < boat.minLevel then
			action(actions, L("shop_level", boat.minLevel), T.panel, false)
			action(actions, L("shop_buy_coins", Ui.fmtNumber(boat.priceCoins)), T.gold, false)
		else
			action(
				actions,
				L("shop_buy_coins", Ui.fmtNumber(boat.priceCoins)),
				T.gold,
				p.coins >= boat.priceCoins,
				function()
					Net.event("BuyWithCoins"):FireServer("boat", boat.id)
				end
			)
		end
	end
end

local function renderOptions(p: any)
	for i, o in Catalog.OPTIONS do
		local _, actions = card(i, o.icon .. " " .. L(o.nameKey), L(o.descKey))
		if p.options[o.id] then
			action(actions, "✓ " .. L("shop_owned"), T.good, false)
		else
			if o.priceCoins then
				local price = o.priceCoins :: number
				action(actions, L("shop_buy_coins", Ui.fmtNumber(price)), T.gold, p.coins >= price, function()
					Net.event("BuyWithCoins"):FireServer("option", o.id)
				end)
			end
			if p.gamePassesEnabled[o.id] then
				action(actions, L("shop_buy_robux", o.robuxHint), T.robux, true, function()
					Net.event("BuyWithRobux"):FireServer("option", o.id)
				end)
			elseif not o.priceCoins then
				action(actions, L("shop_not_configured"), T.panel, false)
			end
		end
	end
end

local function renderCoins(p: any)
	for i, pr in Catalog.PRODUCTS do
		local _, actions = card(i, "🪙 " .. Ui.fmtNumber(pr.coins), L("shop_coins"))
		if p.productsEnabled[pr.id] then
			action(actions, L("shop_buy_robux", pr.robuxHint), T.robux, true, function()
				Net.event("BuyWithRobux"):FireServer("product", pr.id)
			end)
		else
			action(actions, L("shop_not_configured"), T.panel, false)
		end
	end
end

local function render()
	local p = RaceClient.profile
	if not window.Visible or not p then
		return
	end
	clear()
	for k, b in tabButtons do
		b.BackgroundColor3 = if k == tab then T.accent else T.panel2
	end
	if tab == "boats" then
		renderBoats(p)
	elseif tab == "options" then
		renderOptions(p)
	else
		renderCoins(p)
	end
end

function Shop.open()
	window.Visible = true
	render()
end

function Shop.close()
	window.Visible = false
end

local function build()
	gui = Ui.new("ScreenGui", {
		Name = "GrandLargeShop",
		ResetOnSpawn = false,
		DisplayOrder = 10,
		Parent = Players.LocalPlayer:WaitForChild("PlayerGui"),
	})
	window = Ui.panel({
		Size = UDim2.new(0.9, 0, 0.8, 0),
		Position = UDim2.fromScale(0.5, 0.5),
		AnchorPoint = Vector2.new(0.5, 0.5),
		BackgroundColor3 = T.bg,
		BackgroundTransparency = 0.05,
		Visible = false,
		Parent = gui,
	})
	Ui.new("UISizeConstraint", { MaxSize = Vector2.new(720, 620), Parent = window })
	Ui.label({
		Size = UDim2.new(1, 0, 0, 44),
		Text = "🛒 " .. L("shop"),
		TextSize = 26,
		Font = Enum.Font.GothamBlack,
		Parent = window,
	})
	Ui.button({
		Size = UDim2.fromOffset(40, 40),
		Position = UDim2.new(1, -48, 0, 6),
		Text = "✕",
		TextSize = 20,
		BackgroundColor3 = T.bad,
	}, Shop.close).Parent =
		window

	local tabs = Ui.new("Frame", {
		Size = UDim2.new(1, -24, 0, 40),
		Position = UDim2.fromOffset(12, 50),
		BackgroundTransparency = 1,
		Parent = window,
	})
	Ui.list(Enum.FillDirection.Horizontal, 8).Parent = tabs
	for i, def in
		{
			{ "boats", "⛵ " .. L("shop_boats") },
			{ "options", "🪽 " .. L("shop_options") },
			{ "coins", "🪙 " .. L("shop_coins") },
		}
	do
		local key = def[1] :: any
		local b = Ui.button({ Size = UDim2.new(1 / 3, -6, 1, 0), Text = def[2], LayoutOrder = i }, function()
			tab = key
			render()
		end)
		b.Parent = tabs
		tabButtons[key] = b
	end

	content = Ui.new("ScrollingFrame", {
		Size = UDim2.new(1, -24, 1, -110),
		Position = UDim2.fromOffset(12, 100),
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		ScrollBarThickness = 6,
		AutomaticCanvasSize = Enum.AutomaticSize.Y,
		CanvasSize = UDim2.new(),
		Parent = window,
	})
	Ui.list(Enum.FillDirection.Vertical, 8).Parent = content
end

function Shop.start()
	build()
	Hud.OpenShop = Shop.open
	RaceClient.ProfileChanged:Connect(render)
end

return Shop
