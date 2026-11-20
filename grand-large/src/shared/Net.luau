--!strict
-- Tous les remotes du jeu, déclarés ici. Créés par le serveur uniquement.

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")

local Net = {}

-- client → serveur
Net.CLIENT_EVENTS = {
	"Ready", -- le client est prêt, demande l'état courant
	"Helm", -- (mode: string, value: number)
	"Sail", -- (sailId: string)
	"AutoSail", -- (on: boolean)
	"BuyWithCoins", -- (kind: "boat"|"option", id: string)
	"BuyWithRobux", -- (kind: "option"|"product", id: string)
	"SelectBoat", -- (boatId: string)
	"SetAutoJoin", -- (on: boolean)
}
-- serveur → client
Net.SERVER_EVENTS = {
	"Profile", -- vue publique du profil + droits
	"RaceState", -- phase, parcours, vent, flotte
	"RaceEvent", -- événements ponctuels (bouée passée, arrivée, OCS…)
	"Notify", -- (key: string, args: {any}?)
}
Net.UNRELIABLE = {
	"Snapshot", -- positions de la flotte, 10 Hz
}

local FOLDER_NAME = "Remotes"

function Net.setupServer()
	assert(RunService:IsServer(), "Net.setupServer côté serveur uniquement")
	local folder = Instance.new("Folder")
	folder.Name = FOLDER_NAME
	for _, list in { Net.CLIENT_EVENTS, Net.SERVER_EVENTS } do
		for _, name in list do
			local r = Instance.new("RemoteEvent")
			r.Name = name
			r.Parent = folder
		end
	end
	for _, name in Net.UNRELIABLE do
		local r = Instance.new("UnreliableRemoteEvent")
		r.Name = name
		r.Parent = folder
	end
	folder.Parent = ReplicatedStorage
end

local folderCache: Folder? = nil
local function folder(): Folder
	if folderCache then
		return folderCache
	end
	local f = ReplicatedStorage:WaitForChild(FOLDER_NAME) :: Folder
	folderCache = f
	return f
end

function Net.event(name: string): RemoteEvent
	return folder():WaitForChild(name) :: RemoteEvent
end

function Net.unreliable(name: string): UnreliableRemoteEvent
	return folder():WaitForChild(name) :: UnreliableRemoteEvent
end

return Net
