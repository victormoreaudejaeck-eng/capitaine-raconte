--!strict
-- Construit le monde au démarrage : océan (eau Terrain), lumière, ponton du lobby,
-- et les bouées de chaque parcours. Aucun asset externe requis.

local Lighting = game:GetService("Lighting")
local Workspace = game:GetService("Workspace")

local Shared = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Config = require(Shared.Config)
local Checkpoints = require(Shared.Race.Checkpoints)

local WorldService = {}

local courseFolder: Folder? = nil

local function toWorld(x: number, y: number, h: number): Vector3
	return Vector3.new(x, h, -y)
end

local function part(props: { [string]: any }): Part
	local p = Instance.new("Part")
	p.Anchored = true
	p.TopSurface = Enum.SurfaceType.Smooth
	p.BottomSurface = Enum.SurfaceType.Smooth
	for k, v in props do
		(p :: any)[k] = v
	end
	return p
end

local function buildOcean()
	local terrain = Workspace.Terrain
	terrain.WaterWaveSize = 0.35
	terrain.WaterWaveSpeed = 9
	terrain.WaterReflectance = 0.35
	terrain.WaterTransparency = 0.6
	terrain.WaterColor = Color3.fromRGB(18, 92, 128)
	local half = Config.OCEAN_HALF_SIZE
	local chunk = 512
	local depth = 16
	for x = -half, half - chunk, chunk do
		for z = -half, half - chunk, chunk do
			local cf = CFrame.new(x + chunk / 2, Config.WATER_LEVEL - depth / 2, z + chunk / 2)
			terrain:FillBlock(cf, Vector3.new(chunk, depth, chunk), Enum.Material.Water)
		end
		task.wait()
	end
end

local function buildLighting()
	Lighting.ClockTime = 14.5
	Lighting.Brightness = 2.6
	Lighting.EnvironmentDiffuseScale = 0.6
	Lighting.EnvironmentSpecularScale = 0.8
	local atmo = Instance.new("Atmosphere")
	atmo.Density = 0.28
	atmo.Haze = 1.4
	atmo.Glare = 0.4
	atmo.Color = Color3.fromRGB(199, 220, 235)
	atmo.Decay = Color3.fromRGB(120, 150, 175)
	atmo.Parent = Lighting
	local bloom = Instance.new("BloomEffect")
	bloom.Intensity = 0.4
	bloom.Threshold = 1.6
	bloom.Parent = Lighting
	local sun = Instance.new("SunRaysEffect")
	sun.Intensity = 0.04
	sun.Parent = Lighting
end

local function buildDock()
	local folder = Instance.new("Folder")
	folder.Name = "Lobby"
	local d = Config.DOCK_POSITION
	local base = toWorld(d.x, d.y, 1)
	local deck = part({
		Name = "Ponton",
		Size = Vector3.new(90, 2, 50),
		CFrame = CFrame.new(base),
		Color = Color3.fromRGB(150, 110, 70),
		Material = Enum.Material.WoodPlanks,
	})
	deck.Parent = folder
	for i = -1, 1, 2 do
		for j = -1, 1, 2 do
			part({
				Name = "Pieu",
				Size = Vector3.new(2, 14, 2),
				CFrame = CFrame.new(base + Vector3.new(i * 43, -6, j * 23)),
				Color = Color3.fromRGB(90, 65, 40),
				Material = Enum.Material.Wood,
			}).Parent =
				folder
		end
	end
	local spawn = Instance.new("SpawnLocation")
	spawn.Name = "Spawn"
	spawn.Anchored = true
	spawn.Size = Vector3.new(14, 1, 14)
	spawn.CFrame = CFrame.new(base + Vector3.new(0, 1.5, 0))
	spawn.Color = Color3.fromRGB(240, 240, 240)
	spawn.Material = Enum.Material.SmoothPlastic
	spawn.Transparency = 0.2
	spawn.Duration = 0
	spawn.Parent = folder
	-- Phare décoratif
	local tower = part({
		Name = "Phare",
		Shape = Enum.PartType.Cylinder,
		Size = Vector3.new(40, 10, 10),
		CFrame = CFrame.new(base + Vector3.new(-38, 21, -18)) * CFrame.Angles(0, 0, math.rad(90)),
		Color = Color3.fromRGB(235, 235, 235),
		Material = Enum.Material.SmoothPlastic,
	})
	tower.Parent = folder
	local lamp = part({
		Name = "Lanterne",
		Shape = Enum.PartType.Ball,
		Size = Vector3.new(8, 8, 8),
		CFrame = CFrame.new(base + Vector3.new(-38, 44, -18)),
		Color = Color3.fromRGB(255, 220, 120),
		Material = Enum.Material.Neon,
	})
	lamp.Parent = folder
	folder.Parent = Workspace
end

local ROLE_COLORS: { [string]: Color3 } = {
	mark = Color3.fromRGB(255, 170, 20),
	gate = Color3.fromRGB(255, 220, 30),
	pin = Color3.fromRGB(255, 120, 30),
	committee = Color3.fromRGB(240, 240, 240),
}

local function buoy(b: Checkpoints.Buoy, label: string, parent: Instance)
	local pos = toWorld(b.x, b.y, Config.WATER_LEVEL)
	local model = Instance.new("Model")
	model.Name = "Bouee_" .. label
	if b.role == "committee" then
		local hull = part({
			Name = "Comite",
			Size = Vector3.new(10, 4, 22),
			CFrame = CFrame.new(pos + Vector3.new(0, 1.5, 0)),
			Color = Color3.fromRGB(245, 245, 245),
			Material = Enum.Material.SmoothPlastic,
			CanCollide = false,
		})
		hull.Parent = model
		local mast = part({
			Name = "Mat",
			Size = Vector3.new(0.6, 16, 0.6),
			CFrame = CFrame.new(pos + Vector3.new(0, 11, 0)),
			Color = Color3.fromRGB(60, 60, 60),
			CanCollide = false,
		})
		mast.Parent = model
		local flag = part({
			Name = "Pavillon",
			Size = Vector3.new(0.2, 3, 5),
			CFrame = CFrame.new(pos + Vector3.new(0, 17, 2.6)),
			Color = Color3.fromRGB(230, 40, 40),
			Material = Enum.Material.Fabric,
			CanCollide = false,
		})
		flag.Parent = model
		model.PrimaryPart = hull
	else
		local body = part({
			Name = "Corps",
			Shape = Enum.PartType.Cylinder,
			Size = Vector3.new(12, 8, 8),
			CFrame = CFrame.new(pos + Vector3.new(0, 3, 0)) * CFrame.Angles(0, 0, math.rad(90)),
			Color = ROLE_COLORS[b.role] or ROLE_COLORS.mark,
			Material = Enum.Material.SmoothPlastic,
			CanCollide = false,
		})
		body.Parent = model
		local top = part({
			Name = "Sommet",
			Shape = Enum.PartType.Ball,
			Size = Vector3.new(3, 3, 3),
			CFrame = CFrame.new(pos + Vector3.new(0, 10, 0)),
			Color = Color3.fromRGB(255, 255, 255),
			Material = Enum.Material.Neon,
			CanCollide = false,
		})
		top.Parent = model
		model.PrimaryPart = body
	end
	if label ~= "" then
		local gui = Instance.new("BillboardGui")
		gui.Size = UDim2.fromOffset(60, 30)
		gui.StudsOffset = Vector3.new(0, 16, 0)
		gui.AlwaysOnTop = false
		gui.MaxDistance = 1500
		local text = Instance.new("TextLabel")
		text.Size = UDim2.fromScale(1, 1)
		text.BackgroundTransparency = 1
		text.Text = label
		text.TextScaled = true
		text.Font = Enum.Font.GothamBlack
		text.TextColor3 = Color3.new(1, 1, 1)
		text.TextStrokeTransparency = 0.3
		text.Parent = gui
		gui.Parent = model.PrimaryPart
	end
	model.Parent = parent
end

-- Pose les bouées du parcours (les doublons — même bouée rondée deux fois — ne sont posés qu'une fois).
function WorldService.buildCourse(cps: { Checkpoints.Checkpoint })
	if courseFolder then
		courseFolder:Destroy()
	end
	local folder = Instance.new("Folder")
	folder.Name = "Course"
	local placed: { [string]: boolean } = {}
	for _, cp in cps do
		for _, b in cp.buoys do
			local k = string.format("%d:%d", math.floor(b.x), math.floor(b.y))
			if not placed[k] then
				placed[k] = true
				local label = if cp.kind == "mark" or cp.kind == "gate" then cp.label else ""
				buoy(b, label, folder)
			end
		end
	end
	folder.Parent = Workspace
	courseFolder = folder
end

function WorldService.init()
	buildLighting()
	buildDock()
end

function WorldService.start()
	buildOcean()
end

return WorldService
