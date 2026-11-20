--!strict
-- Commandes de barre (clavier, manette, boutons tactiles du HUD).
-- Le client n'envoie que des intentions : cap ou angle au vent visé, voile, auto-voiles.

local ContextActionService = game:GetService("ContextActionService")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

local Shared = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Net = require(Shared.Net)
local Angles = require(Shared.Util.Angles)
local Sails = require(Shared.Sailing.Sails)
local Signal = require(Shared.Util.Signal)
local RaceClient = require(script.Parent.RaceClient)

local HelmController = {}
HelmController.Changed = Signal.new() :: Signal.Signal<>

local STEER_RATE = 35 -- degrés/seconde de consigne quand on maintient une touche
local steerLeft, steerRight = false, false
local dirty = false
local lastSend = 0
local controlsDisabled = false

local function helm()
	return RaceClient.helm()
end

local function markDirty()
	dirty = true
	HelmController.Changed:Fire()
end

function HelmController.setSteer(left: boolean?, right: boolean?)
	if left ~= nil then
		steerLeft = left
	end
	if right ~= nil then
		steerRight = right
	end
end

function HelmController.toggleMode()
	local h = helm()
	local s = RaceClient.myPredicted()
	if not s then
		return
	end
	if h.mode == "heading" then
		h.mode = "twa"
		h.value = s.twa
	else
		h.mode = "heading"
		h.value = s.heading
	end
	markDirty()
end

function HelmController.tack()
	local h = helm()
	local s = RaceClient.myPredicted()
	if not s then
		return
	end
	if h.mode == "twa" then
		h.value = -h.value
	else
		h.value = Angles.wrap360(s.twd + s.twa) -- cap symétrique par rapport au vent
	end
	markDirty()
end

function HelmController.setSail(id: string)
	local h = helm()
	local sail = Sails.get(id)
	if not sail then
		return
	end
	if not Sails.canUse(sail, RaceClient.myEntitlements().sailPack) then
		RaceClient.Notify:Fire("shop_locked_sail", nil)
		return
	end
	h.sail = id
	h.autoSail = false
	Net.event("Sail"):FireServer(id)
	HelmController.Changed:Fire()
end

function HelmController.toggleAuto()
	local h = helm()
	if not RaceClient.myEntitlements().autoSail then
		RaceClient.Notify:Fire("shop_locked_auto", nil)
		return
	end
	h.autoSail = not h.autoSail
	Net.event("AutoSail"):FireServer(h.autoSail)
	HelmController.Changed:Fire()
end

local function setPlayerControls(enabled: boolean)
	local player = Players.LocalPlayer
	local ok, module = pcall(function()
		return require(
				player:WaitForChild("PlayerScripts"):WaitForChild("PlayerModule") :: ModuleScript
			) :: any
	end)
	if ok and module then
		local controls = module:GetControls()
		if enabled then
			controls:Enable()
		else
			controls:Disable()
		end
	end
end

local function bind()
	local function steer(name: string, state: Enum.UserInputState)
		local down = state == Enum.UserInputState.Begin
		if state == Enum.UserInputState.Cancel then
			down = false
		end
		if name == "SteerLeft" then
			steerLeft = down
		else
			steerRight = down
		end
		return Enum.ContextActionResult.Sink
	end
	ContextActionService:BindActionAtPriority("SteerLeft", function(name, state)
		return steer(name, state)
	end, false, 3000, Enum.KeyCode.A, Enum.KeyCode.Left, Enum.KeyCode.ButtonL1)
	ContextActionService:BindActionAtPriority("SteerRight", function(name, state)
		return steer(name, state)
	end, false, 3000, Enum.KeyCode.D, Enum.KeyCode.Right, Enum.KeyCode.ButtonR1)
	ContextActionService:BindActionAtPriority("HelmMode", function(_, state)
		if state == Enum.UserInputState.Begin then
			HelmController.toggleMode()
		end
		return Enum.ContextActionResult.Sink
	end, false, 3000, Enum.KeyCode.Space, Enum.KeyCode.ButtonY)
	ContextActionService:BindActionAtPriority("Tack", function(_, state)
		if state == Enum.UserInputState.Begin then
			HelmController.tack()
		end
		return Enum.ContextActionResult.Sink
	end, false, 3000, Enum.KeyCode.T, Enum.KeyCode.ButtonX)
	ContextActionService:BindActionAtPriority("AutoSail", function(_, state)
		if state == Enum.UserInputState.Begin then
			HelmController.toggleAuto()
		end
		return Enum.ContextActionResult.Sink
	end, false, 3000, Enum.KeyCode.G)
	local keys = {
		Enum.KeyCode.One,
		Enum.KeyCode.Two,
		Enum.KeyCode.Three,
		Enum.KeyCode.Four,
		Enum.KeyCode.Five,
		Enum.KeyCode.Six,
		Enum.KeyCode.Seven,
	}
	for i, key in keys do
		ContextActionService:BindActionAtPriority("Sail" .. i, function(_, state)
			if state == Enum.UserInputState.Begin then
				HelmController.setSail(Sails.LIST[i].id)
			end
			return Enum.ContextActionResult.Sink
		end, false, 3000, key)
	end
	-- W/S neutralisés pendant la course (le personnage reste au ponton)
	ContextActionService:BindActionAtPriority("BlockMove", function()
		return Enum.ContextActionResult.Sink
	end, false, 3000, Enum.KeyCode.W, Enum.KeyCode.S, Enum.KeyCode.Up, Enum.KeyCode.Down)
end

local function unbind()
	for _, name in { "SteerLeft", "SteerRight", "HelmMode", "Tack", "AutoSail", "BlockMove" } do
		ContextActionService:UnbindAction(name)
	end
	for i = 1, 7 do
		ContextActionService:UnbindAction("Sail" .. i)
	end
	steerLeft, steerRight = false, false
end

function HelmController.start()
	local bound = false
	RunService.Heartbeat:Connect(function(dt)
		local racing = RaceClient.isRacing() and RaceClient.myPredicted() ~= nil
		if racing ~= bound then
			bound = racing
			if racing then
				bind()
			else
				unbind()
			end
			if racing ~= controlsDisabled then
				controlsDisabled = racing
				setPlayerControls(not racing)
			end
		end
		if not racing then
			return
		end
		local h = helm()
		local delta = (if steerRight then 1 else 0) - (if steerLeft then 1 else 0)
		if delta ~= 0 then
			if h.mode == "heading" then
				h.value = Angles.wrap360(h.value + delta * STEER_RATE * dt)
			else
				-- tourner à droite = cap qui augmente = TWA qui diminue
				h.value = math.clamp(h.value - delta * STEER_RATE * dt, -180, 180)
			end
			markDirty()
		end
		local now = os.clock()
		if dirty and now - lastSend > 0.1 then
			dirty = false
			lastSend = now
			Net.event("Helm"):FireServer(h.mode, h.value)
		end
	end)
end

return HelmController
