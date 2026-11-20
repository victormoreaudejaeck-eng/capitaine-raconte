--!strict
-- Point d'entrée serveur. Démarrage en deux phases : init() de tous les systèmes,
-- puis start() de tous les systèmes.

local Shared = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Net = require(Shared.Net)

Net.setupServer()

local ORDER = { "DataService", "Entitlements", "ShopService", "WorldService", "RaceService" }

local systems: { [string]: any } = {}
for _, name in ORDER do
	systems[name] = require(script.Systems:WaitForChild(name) :: ModuleScript)
end

for _, name in ORDER do
	local s = systems[name]
	if typeof(s.init) == "function" then
		s.init()
	end
end

for _, name in ORDER do
	local s = systems[name]
	if typeof(s.start) == "function" then
		task.spawn(s.start)
	end
end

print("[Grand Large] serveur démarré")
