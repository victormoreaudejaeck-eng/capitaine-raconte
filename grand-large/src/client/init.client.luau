--!strict
-- Point d'entrée client.

local LocalizationService = game:GetService("LocalizationService")

local Shared = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Strings = require(Shared.Strings)

local ok, locale = pcall(function()
	return LocalizationService.RobloxLocaleId
end)
Strings.setLocale(if ok and locale then locale else "en-us")

local ORDER = { "RaceClient", "HelmController", "CameraController", "BoatRenderer", "WorldFx", "Hud", "Shop" }

local controllers: { [string]: any } = {}
for _, name in ORDER do
	controllers[name] = require(script.Controllers:WaitForChild(name) :: ModuleScript)
end
for _, name in ORDER do
	local c = controllers[name]
	if typeof(c.init) == "function" then
		c.init()
	end
end
for _, name in ORDER do
	local c = controllers[name]
	if typeof(c.start) == "function" then
		task.spawn(c.start)
	end
end
