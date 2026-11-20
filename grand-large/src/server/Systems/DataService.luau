--!strict
-- Persistance des profils joueurs :
--   - UpdateAsync partout (jamais SetAsync), retry + backoff
--   - verrou de session (un seul serveur possède un profil à la fois → pas de duplication)
--   - autosave étalée, sauvegarde au départ et à la fermeture (BindToClose)
--   - schéma versionné + migrations
--   - si le chargement échoue : on expulse plutôt que d'écraser de vraies données
--     (en Studio sans accès API : profil temporaire non sauvegardé)

local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

local Shared = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Config = require(Shared.Config)
local Types = require(Shared.Types)
local Signal = require(Shared.Util.Signal)

type Profile = Types.Profile

local CURRENT_VERSION = 1
local LOCK_STALE = Config.AUTOSAVE_INTERVAL * 3 + 30
local MAX_RECEIPTS = 60

local DEFAULT_PROFILE: Profile = {
	version = CURRENT_VERSION,
	coins = 500,
	xp = 0,
	boats = { DINGHY = true },
	options = {},
	selectedBoat = "DINGHY",
	stats = { races = 0, wins = 0, podiums = 0, bestTimes = {} },
	settings = { autoJoin = true },
	receipts = {},
}

local MIGRATIONS: { [number]: (any) -> any } = {
	-- [1] = function(data) ... return data end,
}

local function deepCopy<T>(v: T): T
	if typeof(v) ~= "table" then
		return v
	end
	local out = {}
	for k, x in v :: any do
		out[k] = deepCopy(x)
	end
	return out :: any
end

-- Complète les champs manquants (nouvelles clés ajoutées au DEFAULT).
local function reconcile(data: any, template: any)
	for k, v in template do
		if data[k] == nil then
			data[k] = deepCopy(v)
		elseif typeof(v) == "table" and typeof(data[k]) == "table" and next(v) ~= nil and #v == 0 then
			reconcile(data[k], v)
		end
	end
end

local function migrate(data: any): any
	while (data.version or 0) < CURRENT_VERSION do
		local v = data.version or 0
		local step = MIGRATIONS[v]
		if step then
			data = step(data)
		end
		data.version = v + 1
	end
	reconcile(data, DEFAULT_PROFILE)
	return data
end

local function withRetry(attempts: number, fn: () -> ...any): boolean
	local delaySeconds = 1
	for attempt = 1, attempts do
		local ok, err = pcall(fn)
		if ok then
			return true
		end
		warn(`[DataService] tentative {attempt}/{attempts} : {err}`)
		if attempt < attempts then
			task.wait(delaySeconds)
			delaySeconds = math.min(delaySeconds * 2, 16)
		end
	end
	return false
end

type Session = {
	profile: Profile,
	temporary: boolean, -- true = jamais sauvegardé (Studio sans DataStore)
	saving: boolean,
	released: boolean,
}

local DataService = {}
DataService.Loaded = Signal.new() :: Signal.Signal<Player, Profile>
DataService.Changed = Signal.new() :: Signal.Signal<Player, Profile>

local sessions: { [Player]: Session } = {}
local store: DataStore? = nil

local function key(player: Player): string
	return "u_" .. tostring(player.UserId)
end

local function jobId(): string
	return if game.JobId ~= "" then game.JobId else "studio"
end

local function load(player: Player): (Profile?, boolean)
	if not store then
		return deepCopy(DEFAULT_PROFILE), true
	end
	local result: Profile? = nil
	local status = "error"
	for _ = 1, 6 do
		local ok = withRetry(3, function()
			(store :: DataStore):UpdateAsync(key(player), function(old: any)
				local now = os.time()
				if
					typeof(old) == "table"
					and typeof(old.lock) == "table"
					and old.lock.jobId ~= jobId()
					and now - (old.lock.t or 0) < LOCK_STALE
				then
					status = "locked"
					return nil -- un autre serveur possède encore ce profil : on n'écrit rien
				end
				local data = if typeof(old) == "table" then migrate(old) else deepCopy(DEFAULT_PROFILE)
				data.lock = { jobId = jobId(), t = now }
				status = "ok"
				result = data
				return data
			end)
		end)
		if not ok then
			return nil, false
		end
		if status == "ok" then
			break
		end
		task.wait(3) -- l'ancien serveur est sans doute en train de sauvegarder
	end
	if status ~= "ok" or not result then
		return nil, false
	end
	local profile = result :: any
	profile.lock = nil
	return profile :: Profile, false
end

local function save(player: Player, release: boolean): boolean
	local s = sessions[player]
	if not s or s.temporary or not store then
		return true
	end
	if s.released then
		return true
	end
	local snapshot = deepCopy(s.profile) :: any
	local ok = withRetry(4, function()
		(store :: DataStore):UpdateAsync(key(player), function(old: any)
			if typeof(old) == "table" and typeof(old.lock) == "table" and old.lock.jobId ~= jobId() then
				warn(`[DataService] verrou perdu pour {player.UserId}, écriture annulée`)
				return nil
			end
			snapshot.lock = if release then nil else { jobId = jobId(), t = os.time() }
			return snapshot
		end)
	end)
	if ok and release then
		s.released = true
	end
	return ok
end

function DataService.get(player: Player): Profile?
	local s = sessions[player]
	return if s then s.profile else nil
end

-- Toute modification de profil passe par ici (puis le client est notifié).
function DataService.update(player: Player, fn: (Profile) -> ()): boolean
	local s = sessions[player]
	if not s then
		return false
	end
	fn(s.profile)
	DataService.Changed:Fire(player, s.profile)
	return true
end

function DataService.saveNow(player: Player): boolean
	return save(player, false)
end

function DataService.hasReceipt(player: Player, purchaseId: string): boolean
	local p = DataService.get(player)
	if not p then
		return false
	end
	return table.find(p.receipts, purchaseId) ~= nil
end

function DataService.addReceipt(profile: Profile, purchaseId: string)
	table.insert(profile.receipts, purchaseId)
	while #profile.receipts > MAX_RECEIPTS do
		table.remove(profile.receipts, 1)
	end
end

function DataService.isTemporary(player: Player): boolean
	local s = sessions[player]
	return s ~= nil and s.temporary
end

local function onPlayerAdded(player: Player)
	local profile, temporary = load(player)
	if not profile then
		if RunService:IsStudio() then
			warn("[DataService] DataStore indisponible en Studio : profil temporaire")
			profile, temporary = deepCopy(DEFAULT_PROFILE), true
		else
			player:Kick(
				"Tes données n'ont pas pu être chargées. Reviens dans un instant ! / Data failed to load, please rejoin."
			)
			return
		end
	end
	if player.Parent ~= Players then
		-- parti pendant le chargement : on relâche le verrou
		sessions[player] =
			{ profile = profile :: Profile, temporary = temporary, saving = false, released = false }
		save(player, true)
		sessions[player] = nil
		return
	end
	sessions[player] =
		{ profile = profile :: Profile, temporary = temporary, saving = false, released = false }
	DataService.Loaded:Fire(player, profile :: Profile)
end

local function onPlayerRemoving(player: Player)
	if sessions[player] then
		save(player, true)
		sessions[player] = nil
	end
end

function DataService.init()
	local ok, ds = pcall(function()
		return DataStoreService:GetDataStore(Config.DATASTORE_NAME)
	end)
	if ok then
		store = ds
	else
		warn("[DataService] DataStoreService indisponible : " .. tostring(ds))
	end
end

function DataService.start()
	Players.PlayerAdded:Connect(onPlayerAdded)
	Players.PlayerRemoving:Connect(onPlayerRemoving)
	for _, p in Players:GetPlayers() do
		task.spawn(onPlayerAdded, p)
	end

	game:BindToClose(function()
		local pending = 0
		for player in sessions do
			pending += 1
			task.spawn(function()
				save(player, true)
				pending -= 1
			end)
		end
		if RunService:IsStudio() then
			return
		end
		local deadline = os.clock() + 25
		while pending > 0 and os.clock() < deadline do
			task.wait(0.2)
		end
	end)

	-- Autosave étalée : chaque joueur a son décalage.
	while true do
		task.wait(5)
		local now = os.time()
		for player, s in sessions do
			local offset = player.UserId % Config.AUTOSAVE_INTERVAL
			if (now + offset) % Config.AUTOSAVE_INTERVAL < 5 and not s.saving then
				s.saving = true
				task.spawn(function()
					save(player, false)
					s.saving = false
				end)
			end
		end
	end
end

return DataService
