--!strict
-- Effets du plan d'eau côté client :
--   - risées visibles : taches sombres sur l'eau là où le vent forcit (lecture tactique !)
--   - traînées de vent autour de la caméra, orientées selon le vent local
--   - repère de la prochaine bouée (balise 3D + distance) et ligne de départ/arrivée

local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")

local Shared = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Config = require(Shared.Config)
local Wind = require(Shared.Sailing.Wind)
local Angles = require(Shared.Util.Angles)
local Geometry = require(Shared.Util.Geometry)
local Strings = require(Shared.Strings)
local RaceClient = require(script.Parent.RaceClient)

local WorldFx = {}

local GRID = 9 -- tuiles de risées autour du bateau (GRID × GRID)
local TILE = 160

local folder: Folder
local tiles: { Part } = {}
local windPart: Part
local windEmitter: ParticleEmitter
local marker: Part
local markerLabel: TextLabel
local lineParts: { Part } = {}

local function mkPart(name: string, size: Vector3): Part
	local p = Instance.new("Part")
	p.Name = name
	p.Size = size
	p.Anchored = true
	p.CanCollide = false
	p.CanQuery = false
	p.CanTouch = false
	p.CastShadow = false
	p.Material = Enum.Material.SmoothPlastic
	p.Parent = folder
	return p
end

local function build()
	folder = Instance.new("Folder")
	folder.Name = "ClientFx"
	folder.Parent = Workspace

	for _ = 1, GRID * GRID do
		local t = mkPart("Gust", Vector3.new(TILE, 0.05, TILE))
		t.Color = Color3.fromRGB(10, 40, 70)
		t.Transparency = 1
		table.insert(tiles, t)
	end

	windPart = mkPart("WindEmitter", Vector3.new(220, 1, 220))
	windPart.Transparency = 1
	windEmitter = Instance.new("ParticleEmitter")
	windEmitter.Texture = "rbxasset://textures/particles/sparkles_main.dds"
	windEmitter.Color = ColorSequence.new(Color3.new(1, 1, 1))
	windEmitter.LightEmission = 0.6
	windEmitter.Transparency = NumberSequence.new({
		NumberSequenceKeypoint.new(0, 1),
		NumberSequenceKeypoint.new(0.3, 0.75),
		NumberSequenceKeypoint.new(1, 1),
	})
	windEmitter.Size = NumberSequence.new(0.35)
	windEmitter.Lifetime = NumberRange.new(2, 3)
	windEmitter.Rate = 60
	windEmitter.Speed = NumberRange.new(20, 30)
	windEmitter.EmissionDirection = Enum.NormalId.Front
	windEmitter.SpreadAngle = Vector2.new(4, 4)
	windEmitter.Parent = windPart

	marker = mkPart("NextMark", Vector3.new(1, 1, 1))
	marker.Transparency = 1
	local gui = Instance.new("BillboardGui")
	gui.Size = UDim2.fromOffset(220, 60)
	gui.AlwaysOnTop = true
	gui.StudsOffset = Vector3.new(0, 26, 0)
	gui.Parent = marker
	markerLabel = Instance.new("TextLabel")
	markerLabel.Size = UDim2.fromScale(1, 1)
	markerLabel.BackgroundTransparency = 1
	markerLabel.Font = Enum.Font.GothamBlack
	markerLabel.TextScaled = true
	markerLabel.TextColor3 = Color3.fromRGB(255, 220, 60)
	markerLabel.TextStrokeTransparency = 0.2
	markerLabel.Parent = gui

	for _ = 1, 40 do
		local p = mkPart("LineDot", Vector3.new(3, 0.3, 3))
		p.Material = Enum.Material.Neon
		p.Color = Color3.fromRGB(255, 230, 80)
		p.Transparency = 1
		table.insert(lineParts, p)
	end
end

local function hideAll()
	for _, t in tiles do
		t.Transparency = 1
	end
	windEmitter.Enabled = false
	marker.Position = Vector3.new(0, -500, 0)
	for _, p in lineParts do
		p.Transparency = 1
	end
end

-- Pointillés lumineux sur le segment à franchir.
local function drawSegment(ax: number, ay: number, bx: number, by: number, maxLen: number)
	local len = math.min(Geometry.distance(ax, ay, bx, by), maxLen)
	local dx, dy = Geometry.normalize(bx - ax, by - ay)
	local n = #lineParts
	for i, p in lineParts do
		local d = (i - 0.5) / n * len
		p.Position = Vector3.new(ax + dx * d, Config.WATER_LEVEL + 0.4, -(ay + dy * d))
		p.Transparency = 0.15
	end
end

function WorldFx.start()
	build()
	hideAll()
	local acc = 0
	RunService.Heartbeat:Connect(function(dt)
		local w = RaceClient.wind()
		local s = RaceClient.state
		if not w or not s or s.phase == "intermission" then
			hideAll()
			return
		end
		local cam = Workspace.CurrentCamera
		local cx, cy = cam.CFrame.Position.X, -cam.CFrame.Position.Z
		local t = RaceClient.serverNow()

		-- traînées de vent
		local twd, tws = Wind.sample(w, cx, cy, t)
		local toX, toY = Angles.dir(Angles.wrap360(twd + 180)) -- vers où il souffle
		windEmitter.Enabled = true
		windEmitter.Rate = 20 + tws * 3
		local center = Vector3.new(cx, Config.WATER_LEVEL + 6, -cy)
		local look = Vector3.new(toX, 0, -toY)
		windPart.CFrame = CFrame.lookAt(center - look * 110, center + look * 10)
		windEmitter.Speed = NumberRange.new(tws * 1.6, tws * 2.2)

		-- risées (rafraîchies 4 fois par seconde)
		acc += dt
		if acc > 0.25 then
			acc = 0
			local gx = math.floor(cx / TILE) * TILE
			local gy = math.floor(cy / TILE) * TILE
			local half = math.floor(GRID / 2)
			local i = 0
			for ix = -half, half do
				for iy = -half, half do
					i += 1
					local tx, ty = gx + ix * TILE + TILE / 2, gy + iy * TILE + TILE / 2
					local _, local_tws = Wind.sample(w, tx, ty, t)
					local rel = (local_tws - w.tws) / math.max(1, w.tws)
					local tile = tiles[i]
					tile.Position = Vector3.new(tx, Config.WATER_LEVEL + 0.15, -ty)
					-- plus sombre = plus de vent ; zones molles un peu plus claires
					if rel > 0.04 then
						tile.Color = Color3.fromRGB(5, 25, 50)
						tile.Transparency = math.clamp(0.95 - rel * 2.2, 0.55, 0.95)
					elseif rel < -0.06 then
						tile.Color = Color3.fromRGB(140, 190, 210)
						tile.Transparency = math.clamp(0.97 + rel * 1.2, 0.8, 0.97)
					else
						tile.Transparency = 1
					end
				end
			end
		end

		-- prochaine bouée
		local me = RaceClient.pose(RaceClient.myId)
		local cps = RaceClient.cps
		if me and #cps > 0 then
			local idx = math.clamp(me.nextCp, 1, #cps)
			local cp = cps[idx]
			marker.Position = Vector3.new(cp.aimX, Config.WATER_LEVEL, -cp.aimY)
			local dist = Geometry.distance(me.x, me.y, cp.aimX, cp.aimY)
			local name = if cp.kind == "start"
				then Strings.get("hud_line")
				elseif cp.kind == "finish" then Strings.get("hud_finish")
				else Strings.get("hud_next", cp.label)
			markerLabel.Text = string.format("%s · %d m", name, math.floor(dist / 2))
			if cp.kind == "mark" then
				drawSegment(cp.ax, cp.ay, cp.bx, cp.by, 140)
			else
				drawSegment(cp.ax, cp.ay, cp.bx, cp.by, 1000)
			end
		else
			marker.Position = Vector3.new(0, -500, 0)
		end
	end)
end

return WorldFx
