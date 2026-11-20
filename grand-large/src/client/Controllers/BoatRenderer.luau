--!strict
-- Construit et anime les bateaux côté client (aucun asset externe) :
-- coques, mât, grand-voile qui s'oriente selon le vent, voile d'avant
-- (foc ou spi gonflé), gîte, foils qui sortent en vol, sillage, étiquette.

local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")

local Shared = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Config = require(Shared.Config)
local Sails = require(Shared.Sailing.Sails)
local BoatClasses = require(Shared.Sailing.BoatClasses)
local RaceClient = require(script.Parent.RaceClient)

type Visual = {
	model: Model,
	root: Part,
	boat: BoatClasses.BoatClass,
	main: Part,
	head: Part,
	spi: Part,
	foils: { Part },
	parts: { BasePart },
	mastTop: number,
	trail: Trail,
	phase: number,
	lastSail: string,
	lastFlying: boolean,
	smoothHeel: number,
	smoothLift: number,
}

local BoatRenderer = {}

local folder: Folder? = nil
local visuals: { [string]: Visual } = {}

local HULL_COLORS = {
	Color3.fromRGB(240, 240, 240),
	Color3.fromRGB(20, 30, 50),
	Color3.fromRGB(200, 30, 40),
	Color3.fromRGB(255, 200, 0),
	Color3.fromRGB(0, 140, 200),
	Color3.fromRGB(30, 160, 90),
	Color3.fromRGB(240, 110, 20),
	Color3.fromRGB(120, 60, 180),
}

local function colorFor(id: string): Color3
	local h = 0
	for i = 1, #id do
		h = (h * 31 + string.byte(id, i)) % 9973
	end
	return HULL_COLORS[h % #HULL_COLORS + 1]
end

local function mk(
	model: Model,
	name: string,
	size: Vector3,
	color: Color3,
	material: Enum.Material?,
	shape: Enum.PartType?
): Part
	local p = Instance.new("Part")
	p.Name = name
	p.Size = size
	p.Color = color
	p.Material = material or Enum.Material.SmoothPlastic
	if shape then
		p.Shape = shape
	end
	p.Anchored = true
	p.CanCollide = false
	p.CanQuery = false
	p.CanTouch = false
	p.CastShadow = true
	p.TopSurface = Enum.SurfaceType.Smooth
	p.BottomSurface = Enum.SurfaceType.Smooth
	p.Parent = model
	return p
end

-- Les pièces sont positionnées chaque frame à partir de décalages locaux (CFrame relatif à la racine).
local offsets: { [BasePart]: CFrame } = {}

local function place(p: BasePart, cf: CFrame)
	offsets[p] = cf
end

local function build(id: string, info: any): Visual?
	local boat = BoatClasses.get(info.boat)
	if not boat then
		return nil
	end
	local L = boat.length
	local model = Instance.new("Model")
	model.Name = id
	local hullColor = colorFor(id)
	local root = mk(model, "Root", Vector3.new(1, 1, 1), hullColor)
	root.Transparency = 1
	model.PrimaryPart = root

	local hullW = L * 0.26
	local deckY = 1.2
	local foils: { Part } = {}
	local style = boat.style

	local function hull(name: string, x: number, w: number, len: number, h: number)
		local body = mk(model, name, Vector3.new(w, h, len * 0.82), hullColor)
		place(body, CFrame.new(x, deckY - h / 2, len * 0.06))
		local bow = mk(model, name .. "Bow", Vector3.new(w, h, len * 0.22), hullColor, nil, nil)
		local wedge = Instance.new("SpecialMesh")
		wedge.MeshType = Enum.MeshType.Wedge
		wedge.Parent = bow
		place(bow, CFrame.new(x, deckY - h / 2, -len * 0.45) * CFrame.Angles(0, 0, math.rad(180)))
		local deck =
			mk(model, name .. "Deck", Vector3.new(w * 0.92, 0.2, len * 0.8), Color3.fromRGB(235, 230, 220))
		place(deck, CFrame.new(x, deckY + 0.05, len * 0.07))
	end

	if style == "trimaran" then
		hull("Hull", 0, hullW * 0.55, L, 3.2)
		hull("FloatL", -L * 0.34, hullW * 0.35, L * 0.85, 2.4)
		hull("FloatR", L * 0.34, hullW * 0.35, L * 0.85, 2.4)
		for _, z in { -L * 0.12, L * 0.2 } do
			local beam = mk(model, "Beam", Vector3.new(L * 0.7, 0.8, 1.4), Color3.fromRGB(30, 30, 30))
			place(beam, CFrame.new(0, deckY + 0.6, z))
		end
	elseif style == "foilCat" then
		hull("HullL", -L * 0.24, hullW * 0.32, L, 2.2)
		hull("HullR", L * 0.24, hullW * 0.32, L, 2.2)
		local tramp = mk(
			model,
			"Trampoline",
			Vector3.new(L * 0.46, 0.2, L * 0.5),
			Color3.fromRGB(25, 25, 25),
			Enum.Material.Fabric
		)
		place(tramp, CFrame.new(0, deckY + 0.2, 0))
	else
		local h = if style == "dinghy" then 1.6 else 3.4
		hull("Hull", 0, hullW, L, h)
		if style ~= "dinghy" then
			local keel = mk(model, "Keel", Vector3.new(0.6, L * 0.32, L * 0.12), Color3.fromRGB(40, 40, 40))
			place(keel, CFrame.new(0, -L * 0.16, L * 0.05))
		end
	end

	-- Foils (visibles en vol ou pour les foilers)
	if boat.foilCapable then
		for _, side in { -1, 1 } do
			local x = if style == "foilCat"
				then side * L * 0.24
				elseif style == "trimaran" then side * L * 0.34
				else side * hullW * 0.55
			local f = mk(model, "Foil", Vector3.new(L * 0.18, 0.4, 1.6), Color3.fromRGB(20, 20, 25))
			place(
				f,
				CFrame.new(x + side * L * 0.06, -L * 0.07, -L * 0.05)
					* CFrame.Angles(0, 0, side * math.rad(-25))
			)
			table.insert(foils, f)
		end
		if style == "foilCat" then
			local rudder = mk(model, "RudderFoil", Vector3.new(L * 0.3, 0.3, 1.2), Color3.fromRGB(20, 20, 25))
			place(rudder, CFrame.new(0, -L * 0.1, L * 0.45))
			table.insert(foils, rudder)
		end
	end

	-- Mât + voiles
	local mastH = if style == "dinghy" then L * 1.25 else L * 1.05
	local mastZ = -L * 0.08
	local mast =
		mk(model, "Mast", Vector3.new(0.5, mastH, 0.5), Color3.fromRGB(50, 50, 55), Enum.Material.Metal)
	place(mast, CFrame.new(0, deckY + mastH / 2, mastZ))

	local main = mk(
		model,
		"MainSail",
		Vector3.new(0.12, mastH * 0.9, L * 0.42),
		Color3.fromRGB(245, 245, 245),
		Enum.Material.Fabric
	)
	main.Transparency = 0.05
	local head = mk(
		model,
		"HeadSail",
		Vector3.new(0.12, mastH * 0.75, L * 0.34),
		Color3.fromRGB(245, 245, 245),
		Enum.Material.Fabric
	)
	local spi = mk(
		model,
		"Spi",
		Vector3.new(L * 0.5, mastH * 0.65, L * 0.4),
		Color3.fromRGB(230, 60, 60),
		Enum.Material.Fabric,
		Enum.PartType.Ball
	)
	spi.Transparency = 0.05

	-- Sillage
	local a0 = Instance.new("Attachment")
	a0.Position = Vector3.new(-hullW * 0.5, 0.2, L * 0.5)
	a0.Parent = root
	local a1 = Instance.new("Attachment")
	a1.Position = Vector3.new(hullW * 0.5, 0.2, L * 0.5)
	a1.Parent = root
	local trail = Instance.new("Trail")
	trail.Attachment0 = a0
	trail.Attachment1 = a1
	trail.Lifetime = 3
	trail.MinLength = 0.5
	trail.FaceCamera = false
	trail.Color = ColorSequence.new(Color3.fromRGB(235, 250, 255))
	trail.Transparency = NumberSequence.new({
		NumberSequenceKeypoint.new(0, 0.25),
		NumberSequenceKeypoint.new(1, 1),
	})
	trail.WidthScale = NumberSequence.new({
		NumberSequenceKeypoint.new(0, 1),
		NumberSequenceKeypoint.new(1, 3),
	})
	trail.LightEmission = 0.3
	trail.Parent = root

	-- Étiquette
	local tag = Instance.new("BillboardGui")
	tag.Size = UDim2.fromOffset(180, 34)
	tag.StudsOffset = Vector3.new(0, mastH + 6, 0)
	tag.MaxDistance = 1200
	tag.AlwaysOnTop = true
	local label = Instance.new("TextLabel")
	label.Size = UDim2.fromScale(1, 1)
	label.BackgroundTransparency = 1
	label.Font = Enum.Font.GothamBold
	label.TextScaled = true
	label.TextColor3 = if id == RaceClient.myId then Color3.fromRGB(255, 220, 80) else Color3.new(1, 1, 1)
	label.TextStrokeTransparency = 0.4
	label.Text = info.name
	label.Parent = tag
	tag.Parent = root

	model.Parent = folder
	local parts: { BasePart } = {}
	for _, d in model:GetDescendants() do
		if d:IsA("BasePart") and d ~= root then
			table.insert(parts, d)
		end
	end
	return {
		parts = parts,
		model = model,
		root = root,
		boat = boat,
		main = main,
		head = head,
		spi = spi,
		foils = foils,
		mastTop = mastH,
		trail = trail,
		phase = (#id * 1.7) % 6.28,
		lastSail = "",
		lastFlying = false,
		smoothHeel = 0,
		smoothLift = 0,
	}
end

local function destroyVisual(id: string)
	local v = visuals[id]
	if v then
		for _, p in v.model:GetDescendants() do
			if p:IsA("BasePart") then
				offsets[p] = nil
			end
		end
		v.model:Destroy()
		visuals[id] = nil
	end
end

local function update(v: Visual, pose: RaceClient.Pose, t: number, dt: number)
	local boat = v.boat
	local L = boat.length
	local twaAbs = math.abs(pose.twa)
	local side = if pose.twa >= 0 then 1 else -1

	-- Gîte : sous le vent, plus forte au près et au reaching, faible pour les multicoques.
	local heelMax = if boat.style == "trimaran" or boat.style == "foilCat"
		then 6
		elseif boat.style == "dinghy" then 18
		else 22
	local heelTarget = side
		* heelMax
		* math.clamp(pose.tws / 20, 0, 1)
		* math.clamp(1.3 - twaAbs / 150, 0.15, 1)
	v.smoothHeel += (heelTarget - v.smoothHeel) * math.min(1, dt * 2)

	-- Envol
	local liftTarget = if pose.flying then (if boat.style == "foilCat" then L * 0.1 else L * 0.04) else 0
	v.smoothLift += (liftTarget - v.smoothLift) * math.min(1, dt * 1.5)

	local bob = if pose.flying then 0.05 else math.sin(t * 1.4 + v.phase) * 0.35
	local pitch = if pose.flying then 0 else math.sin(t * 1.1 + v.phase * 2) * math.rad(1.5)
	local pos = Vector3.new(pose.x, Config.WATER_LEVEL + 0.2 + bob + v.smoothLift, -pose.y)
	local rootCf = CFrame.new(pos)
		* CFrame.Angles(0, -math.rad(pose.heading), 0)
		* CFrame.Angles(pitch, 0, math.rad(v.smoothHeel))
	v.root.CFrame = rootCf

	-- Grand-voile : bôme sous le vent, ouverture ≈ TWA / 2
	local boom = -side * math.rad(math.clamp(twaAbs * 0.5, 4, 80))
	local mastZ = -L * 0.08
	local mainSize = v.main.Size
	offsets[v.main] = CFrame.new(0, 1.2 + v.mastTop * 0.5, mastZ)
		* CFrame.Angles(0, boom, 0)
		* CFrame.new(0, 0, mainSize.Z / 2)

	-- Voile d'avant
	local sail = Sails.get(pose.sail) or Sails.LIST[1]
	if sail.id ~= v.lastSail then
		v.lastSail = sail.id
		local c = Color3.fromRGB(sail.color[1], sail.color[2], sail.color[3])
		v.head.Color = c
		v.spi.Color = c
	end
	if sail.downwind then
		v.head.Transparency = 1
		v.spi.Transparency = 0.05
		local lee = -side * math.clamp((twaAbs - 60) / 120, 0, 1) * L * 0.28
		offsets[v.spi] = CFrame.new(lee, 1.2 + v.mastTop * 0.42, -L * 0.6)
	else
		v.spi.Transparency = 1
		v.head.Transparency = 0.05
		local headBoom = -side * math.rad(math.clamp(twaAbs * 0.35, 6, 40))
		offsets[v.head] = CFrame.new(0, 1.2 + v.mastTop * 0.4, -L * 0.48)
			* CFrame.Angles(0, headBoom, 0)
			* CFrame.new(0, 0, v.head.Size.Z / 2)
	end

	-- Foils : visibles pour les foilers, ou en vol
	local showFoils = boat.foilsBuiltIn or pose.flying
	if showFoils ~= v.lastFlying then
		v.lastFlying = showFoils
		for _, f in v.foils do
			f.Transparency = if showFoils then 0 else 1
		end
	end

	-- Sillage : plus large et visible avec la vitesse
	v.trail.Enabled = pose.speed > 1

	for _, part in v.parts do
		local off = offsets[part]
		if off then
			part.CFrame = rootCf * off
		end
	end
end

function BoatRenderer.start()
	local f = Instance.new("Folder")
	f.Name = "ClientBoats"
	f.Parent = Workspace
	folder = f

	RaceClient.StateChanged:Connect(function(state)
		if state.phase == "intermission" then
			for id in visuals do
				destroyVisual(id)
			end
		end
	end)

	RunService.RenderStepped:Connect(function(dt)
		local t = os.clock()
		local roster = RaceClient.roster
		for id in visuals do
			if not roster[id] then
				destroyVisual(id)
			end
		end
		for id, info in roster do
			local pose = RaceClient.pose(id)
			if pose then
				local v = visuals[id]
				if not v then
					local built = build(id, info)
					if built then
						visuals[id] = built
						v = built
					end
				end
				if v then
					update(v, pose, t, dt)
				end
			end
		end
	end)
end

function BoatRenderer.modelOf(id: string): Model?
	local v = visuals[id]
	return if v then v.model else nil
end

return BoatRenderer
