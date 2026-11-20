--!strict
-- Caméra de course : poursuite derrière son bateau (orbite souris/doigt, zoom molette)
-- ou vue tactique de dessus (touche C). En spectateur : suit le leader.

local ContextActionService = game:GetService("ContextActionService")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local Workspace = game:GetService("Workspace")

local Shared = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Config = require(Shared.Config)
local RaceClient = require(script.Parent.RaceClient)

local CameraController = {}

local mode: "chase" | "top" = "chase"
local yaw = 0 -- orbite autour du bateau (degrés)
local pitch = 18
local distance = 70
local dragging = false
local active = false
local smoothPos: Vector3? = nil
local focusId: string? = nil

function CameraController.toggleView()
	mode = if mode == "chase" then "top" else "chase"
end

function CameraController.viewMode(): string
	return mode
end

local function focus(): string?
	local s = RaceClient.state
	if not s or (s.phase ~= "prestart" and s.phase ~= "racing" and s.phase ~= "results") then
		return nil
	end
	if RaceClient.roster[RaceClient.myId] then
		return RaceClient.myId
	end
	local ranking = RaceClient.ranking()
	return if ranking[1] then ranking[1].id else nil
end

function CameraController.start()
	local camera = Workspace.CurrentCamera
	ContextActionService:BindAction("ToggleView", function(_, state)
		if state == Enum.UserInputState.Begin and active then
			CameraController.toggleView()
		end
		return Enum.ContextActionResult.Pass
	end, false, Enum.KeyCode.C, Enum.KeyCode.ButtonSelect)

	UserInputService.InputBegan:Connect(function(input, processed)
		if processed then
			return
		end
		if input.UserInputType == Enum.UserInputType.MouseButton2 then
			dragging = true
		end
	end)
	UserInputService.InputEnded:Connect(function(input)
		if input.UserInputType == Enum.UserInputType.MouseButton2 then
			dragging = false
		end
	end)
	UserInputService.InputChanged:Connect(function(input: InputObject, processed: boolean)
		if not active then
			return
		end
		if input.UserInputType == Enum.UserInputType.MouseWheel and not processed then
			distance = math.clamp(distance * (1 - input.Position.Z * 0.12), 25, 420)
		elseif input.UserInputType == Enum.UserInputType.MouseMovement and dragging then
			yaw -= input.Delta.X * 0.35
			pitch = math.clamp(pitch + input.Delta.Y * 0.25, 4, 75)
		elseif input.UserInputType == Enum.UserInputType.Touch and not processed then
			yaw -= input.Delta.X * 0.3
			pitch = math.clamp(pitch + input.Delta.Y * 0.2, 4, 75)
		end
	end)

	RunService:BindToRenderStep("GrandLargeCamera", Enum.RenderPriority.Camera.Value + 1, function(dt: number)
		local id = focus()
		local pose = if id then RaceClient.pose(id) else nil
		if not pose then
			if active then
				active = false
				camera.CameraType = Enum.CameraType.Custom
				smoothPos = nil
			end
			return
		end
		if not active then
			active = true
			camera.CameraType = Enum.CameraType.Scriptable
		end
		if id ~= focusId then
			focusId = id
			smoothPos = nil
		end
		local boatPos = Vector3.new(pose.x, Config.WATER_LEVEL + 4, -pose.y)
		if mode == "top" then
			local h = math.max(distance * 6, 600)
			local target = boatPos
			local camPos = target + Vector3.new(0, h, 0.01)
			camera.CFrame = CFrame.lookAt(camPos, target, Vector3.new(0, 0, -1))
			camera.FieldOfView = 50
			return
		end
		camera.FieldOfView = 70
		local ang = math.rad(pose.heading + yaw)
		local back = Vector3.new(-math.sin(ang), 0, math.cos(ang)) -- derrière le bateau
		local p = math.rad(pitch)
		local offset = back * distance * math.cos(p) + Vector3.new(0, distance * math.sin(p) + 6, 0)
		local wanted = boatPos + offset
		local sp = smoothPos
		if sp then
			sp = sp:Lerp(wanted, math.min(1, dt * 6))
		else
			sp = wanted
		end
		smoothPos = sp
		camera.CFrame = CFrame.lookAt(sp :: Vector3, boatPos + Vector3.new(0, 6, 0))
	end)
end

return CameraController
