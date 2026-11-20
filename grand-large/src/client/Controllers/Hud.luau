--!strict
-- Interface de course : bandeau de phase, instruments (vitesse, cap, TWA, vent, VMG),
-- rose des vents, mini-polaire en direct, barre de voiles, boutons tactiles,
-- classement live, compte à rebours, résultats et notifications.

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")

local Shared = game:GetService("ReplicatedStorage"):WaitForChild("Shared")
local Strings = require(Shared.Strings)
local Net = require(Shared.Net)
local Sails = require(Shared.Sailing.Sails)
local Polars = require(Shared.Sailing.Polars)
local BoatClasses = require(Shared.Sailing.BoatClasses)
local Autopilot = require(Shared.Sailing.Autopilot)
local Courses = require(Shared.Race.Courses)
local Physics = require(Shared.Sailing.Physics)
local Ui = require(script.Parent.Parent.Ui.Ui)
local RaceClient = require(script.Parent.RaceClient)
local HelmController = require(script.Parent.HelmController)
local CameraController = require(script.Parent.CameraController)

local T = Ui.Theme
local L = Strings.get

local Hud = {}
Hud.OpenShop = nil :: (() -> ())?

local gui: ScreenGui
local banner: TextLabel
local subBanner: TextLabel
local countdown: TextLabel
local instruments: Frame
local speedLabel: TextLabel
local targetLabel: TextLabel
local rows: { [string]: TextLabel } = {}
local statusLabel: TextLabel
local adviceLabel: TextLabel
local compass: Frame
local windArrow: Frame
local polarFrame: Frame
local polarDots: { Frame } = {}
local polarMe: Frame
local sailBar: Frame
local sailButtons: { [string]: TextButton } = {}
local autoButton: TextButton
local modeButton: TextButton
local controlsBar: Frame
local rankFrame: Frame
local rankRows: { TextLabel } = {}
local resultsFrame: Frame
local topLeft: Frame
local coinsLabel: TextLabel
local levelLabel: TextLabel
local autoJoinButton: TextButton
local toastHolder: Frame
local helpLabel: TextLabel

local function translateArg(a: any): any
	if typeof(a) == "string" then
		local t = L(a)
		return t
	end
	return a
end

function Hud.toast(key: string, args: { any }?)
	local text
	if key == "shop_locked_sail" then
		text = L("opt_SAILPACK") .. " → " .. L("shop")
	elseif key == "shop_locked_auto" then
		text = L("opt_AUTOSAIL") .. " → " .. L("shop")
	elseif args then
		local tr = {}
		for i, a in args do
			tr[i] = translateArg(a)
		end
		text = L(key, table.unpack(tr))
	else
		text = L(key)
	end
	local f = Ui.panel({
		Size = UDim2.new(1, 0, 0, 40),
		BackgroundColor3 = T.panel2,
		Parent = toastHolder,
	})
	Ui.label({ Size = UDim2.fromScale(1, 1), Text = text, TextSize = 18, Parent = f })
	task.delay(3.5, function()
		local tween = TweenService:Create(f, TweenInfo.new(0.4), { BackgroundTransparency = 1 })
		tween:Play()
		tween.Completed:Wait()
		f:Destroy()
	end)
end

local function row(parent: Instance, key: string, order: number): TextLabel
	local f = Ui.new(
		"Frame",
		{ Size = UDim2.new(1, 0, 0, 24), BackgroundTransparency = 1, LayoutOrder = order, Parent = parent }
	)
	Ui.label({
		Size = UDim2.new(0.45, 0, 1, 0),
		Text = L(key),
		TextColor3 = T.dim,
		TextSize = 14,
		TextXAlignment = Enum.TextXAlignment.Left,
		Parent = f,
	})
	local v = Ui.label({
		Size = UDim2.new(0.55, 0, 1, 0),
		Position = UDim2.fromScale(0.45, 0),
		Text = "-",
		TextSize = 18,
		TextXAlignment = Enum.TextXAlignment.Right,
		Parent = f,
	})
	return v
end

local function build()
	local player = Players.LocalPlayer
	gui = Ui.new("ScreenGui", {
		Name = "GrandLargeHud",
		ResetOnSpawn = false,
		IgnoreGuiInset = false,
		ZIndexBehavior = Enum.ZIndexBehavior.Sibling,
		Parent = player:WaitForChild("PlayerGui"),
	})

	-- Bandeau
	local top =
		Ui.panel({ Size = UDim2.fromOffset(460, 62), Position = UDim2.new(0.5, -230, 0, 8), Parent = gui })
	banner = Ui.label({
		Size = UDim2.new(1, 0, 0, 34),
		Text = L("game_title"),
		TextSize = 22,
		Font = Enum.Font.GothamBlack,
		Parent = top,
	})
	subBanner = Ui.label({
		Size = UDim2.new(1, 0, 0, 22),
		Position = UDim2.fromOffset(0, 34),
		Text = "",
		TextSize = 14,
		TextColor3 = T.dim,
		Parent = top,
	})

	countdown = Ui.label({
		Size = UDim2.fromOffset(400, 140),
		Position = UDim2.new(0.5, -200, 0.3, -70),
		Text = "",
		TextSize = 110,
		Font = Enum.Font.GothamBlack,
		TextColor3 = T.gold,
		TextStrokeTransparency = 0.3,
		Visible = false,
		Parent = gui,
	})

	-- Haut gauche : pièces, niveau, boutique
	topLeft =
		Ui.panel({ Size = UDim2.fromOffset(230, 104), Position = UDim2.fromOffset(10, 60), Parent = gui })
	Ui.padding(8).Parent = topLeft
	coinsLabel = Ui.label({
		Size = UDim2.new(1, 0, 0, 24),
		Text = "🪙 -",
		TextSize = 20,
		TextXAlignment = Enum.TextXAlignment.Left,
		TextColor3 = T.gold,
		Parent = topLeft,
	})
	levelLabel = Ui.label({
		Size = UDim2.new(1, 0, 0, 18),
		Position = UDim2.fromOffset(0, 24),
		Text = "",
		TextSize = 14,
		TextColor3 = T.dim,
		TextXAlignment = Enum.TextXAlignment.Left,
		Parent = topLeft,
	})
	Ui.button({
		Size = UDim2.new(0.5, -3, 0, 34),
		Position = UDim2.fromOffset(0, 50),
		Text = "🛒 " .. L("shop"),
		BackgroundColor3 = T.accent,
	}, function()
		if Hud.OpenShop then
			Hud.OpenShop()
		end
	end).Parent =
		topLeft
	autoJoinButton = Ui.button({
		Size = UDim2.new(0.5, -3, 0, 34),
		Position = UDim2.new(0.5, 3, 0, 50),
		Text = "⛵ ON",
		TextSize = 14,
	}, function()
		local p = RaceClient.profile
		if p then
			Net.event("SetAutoJoin"):FireServer(not p.autoJoin)
		end
	end)
	autoJoinButton.Parent = topLeft

	-- Instruments
	instruments =
		Ui.panel({ Size = UDim2.fromOffset(230, 290), Position = UDim2.new(0, 10, 0.5, -110), Parent = gui })
	Ui.padding(10).Parent = instruments
	local list = Ui.list(Enum.FillDirection.Vertical, 2)
	list.Parent = instruments
	Ui.label({
		Size = UDim2.new(1, 0, 0, 16),
		Text = L("hud_speed"),
		TextColor3 = T.dim,
		TextSize = 13,
		LayoutOrder = 1,
		Parent = instruments,
	})
	speedLabel = Ui.label({
		Size = UDim2.new(1, 0, 0, 52),
		Text = "0.0 kn",
		TextSize = 46,
		Font = Enum.Font.GothamBlack,
		LayoutOrder = 2,
		Parent = instruments,
	})
	targetLabel = Ui.label({
		Size = UDim2.new(1, 0, 0, 16),
		Text = "",
		TextColor3 = T.dim,
		TextSize = 13,
		LayoutOrder = 3,
		Parent = instruments,
	})
	rows.heading = row(instruments, "hud_heading", 4)
	rows.twa = row(instruments, "hud_twa", 5)
	rows.tws = row(instruments, "hud_tws", 6)
	rows.vmg = row(instruments, "hud_vmg", 7)
	statusLabel = Ui.label({
		Size = UDim2.new(1, 0, 0, 22),
		Text = "",
		TextSize = 15,
		TextColor3 = T.gold,
		LayoutOrder = 8,
		Parent = instruments,
	})
	adviceLabel = Ui.label({
		Size = UDim2.new(1, 0, 0, 30),
		Text = "",
		TextSize = 12,
		TextColor3 = T.dim,
		TextWrapped = true,
		LayoutOrder = 9,
		Parent = instruments,
	})

	-- Rose des vents (bateau toujours vers le haut)
	compass = Ui.new("Frame", {
		Size = UDim2.fromOffset(140, 140),
		Position = UDim2.new(1, -150, 1, -300),
		BackgroundColor3 = T.panel,
		BackgroundTransparency = 0.2,
		Parent = gui,
	}, { Ui.corner(70) :: Instance, Ui.stroke(T.accent, 2, 0.4) })
	Ui.label({
		Size = UDim2.fromOffset(20, 40),
		Position = UDim2.new(0.5, -10, 0.5, -20),
		Text = "▲",
		TextSize = 34,
		TextColor3 = T.text,
		Parent = compass,
	})
	windArrow =
		Ui.new("Frame", { Size = UDim2.fromOffset(140, 140), BackgroundTransparency = 1, Parent = compass })
	Ui.label({
		Size = UDim2.fromOffset(30, 30),
		Position = UDim2.new(0.5, -15, 0, -2),
		Text = "▼",
		TextSize = 28,
		TextColor3 = T.accent,
		Parent = windArrow,
	})
	Ui.label({
		Size = UDim2.fromOffset(60, 16),
		Position = UDim2.new(0.5, -30, 0, 22),
		Text = L("hud_tws"),
		TextSize = 11,
		TextColor3 = T.accent,
		Parent = windArrow,
	})

	-- Mini-polaire (demi-cercle tribord, vitesse selon l'angle)
	polarFrame =
		Ui.panel({ Size = UDim2.fromOffset(140, 140), Position = UDim2.new(1, -150, 1, -452), Parent = gui })
	Ui.label({
		Size = UDim2.new(1, 0, 0, 14),
		Position = UDim2.fromOffset(0, 2),
		Text = "POLAIRE",
		TextSize = 11,
		TextColor3 = T.dim,
		Parent = polarFrame,
	})
	for _ = 1, 35 do
		local d = Ui.new("Frame", {
			Size = UDim2.fromOffset(3, 3),
			BackgroundColor3 = T.accent,
			BorderSizePixel = 0,
			Parent = polarFrame,
		})
		table.insert(polarDots, d)
	end
	polarMe = Ui.new(
		"Frame",
		{ Size = UDim2.fromOffset(9, 9), BackgroundColor3 = T.gold, BorderSizePixel = 0, Parent = polarFrame },
		{ Ui.corner(5) }
	)

	-- Classement
	rankFrame =
		Ui.panel({ Size = UDim2.fromOffset(220, 260), Position = UDim2.new(1, -230, 0, 60), Parent = gui })
	Ui.padding(8).Parent = rankFrame
	Ui.list(Enum.FillDirection.Vertical, 2).Parent = rankFrame
	for i = 1, 10 do
		local r = Ui.label({
			Size = UDim2.new(1, 0, 0, 22),
			Text = "",
			TextSize = 14,
			TextXAlignment = Enum.TextXAlignment.Left,
			LayoutOrder = i,
			Parent = rankFrame,
		})
		table.insert(rankRows, r)
	end

	-- Voiles
	sailBar =
		Ui.panel({ Size = UDim2.fromOffset(560, 52), Position = UDim2.new(0.5, -280, 1, -64), Parent = gui })
	Ui.padding(6).Parent = sailBar
	Ui.list(Enum.FillDirection.Horizontal, 5).Parent = sailBar
	for i, s in Sails.LIST do
		local b = Ui.button({
			Size = UDim2.fromOffset(62, 40),
			Text = tostring(i) .. " " .. s.short,
			TextSize = 13,
			LayoutOrder = i,
		}, function()
			HelmController.setSail(s.id)
		end)
		Ui.new("Frame", {
			Size = UDim2.new(1, -10, 0, 4),
			Position = UDim2.new(0, 5, 1, -6),
			BackgroundColor3 = Color3.fromRGB(s.color[1], s.color[2], s.color[3]),
			BorderSizePixel = 0,
			Parent = b,
		})
		b.Parent = sailBar
		sailButtons[s.id] = b
	end
	autoButton = Ui.button({
		Size = UDim2.fromOffset(80, 40),
		Text = "G " .. L("hud_auto"),
		TextSize = 12,
		LayoutOrder = 99,
		TextWrapped = true,
	}, function()
		HelmController.toggleAuto()
	end)
	autoButton.Parent = sailBar

	-- Commandes (tactile + souris)
	controlsBar = Ui.new("Frame", {
		Size = UDim2.fromOffset(560, 56),
		Position = UDim2.new(0.5, -280, 1, -126),
		BackgroundTransparency = 1,
		Parent = gui,
	})
	local function holdButton(text: string, x: UDim2, onDown: (boolean) -> ()): TextButton
		local b = Ui.button({
			Size = UDim2.fromOffset(90, 52),
			Position = x,
			Text = text,
			TextSize = 28,
			BackgroundColor3 = T.panel2,
		})
		b.InputBegan:Connect(function(input)
			if
				input.UserInputType == Enum.UserInputType.MouseButton1
				or input.UserInputType == Enum.UserInputType.Touch
			then
				onDown(true)
			end
		end)
		b.InputEnded:Connect(function(input)
			if
				input.UserInputType == Enum.UserInputType.MouseButton1
				or input.UserInputType == Enum.UserInputType.Touch
			then
				onDown(false)
			end
		end)
		b.Parent = controlsBar
		return b
	end
	holdButton("◀", UDim2.fromOffset(0, 0), function(d)
		HelmController.setSteer(d, nil)
	end)
	holdButton("▶", UDim2.new(1, -90, 0, 0), function(d)
		HelmController.setSteer(nil, d)
	end)
	modeButton = Ui.button({
		Size = UDim2.fromOffset(170, 52),
		Position = UDim2.fromOffset(100, 0),
		Text = "",
		TextSize = 14,
		TextWrapped = true,
	}, function()
		HelmController.toggleMode()
	end)
	modeButton.Parent = controlsBar
	Ui.button({
		Size = UDim2.fromOffset(120, 52),
		Position = UDim2.fromOffset(280, 0),
		Text = "↔ " .. L("hud_tack"),
		TextSize = 13,
		TextWrapped = true,
		BackgroundColor3 = Color3.fromRGB(120, 60, 20),
	}, function()
		HelmController.tack()
	end).Parent =
		controlsBar
	Ui.button(
		{ Size = UDim2.fromOffset(50, 52), Position = UDim2.fromOffset(410, 0), Text = "🎥", TextSize = 22 },
		function()
			CameraController.toggleView()
		end
	).Parent =
		controlsBar

	helpLabel = Ui.label({
		Size = UDim2.new(1, 0, 0, 18),
		Position = UDim2.new(0, 0, 1, -146),
		Text = L("hud_controls"),
		TextSize = 13,
		TextColor3 = T.dim,
		Visible = not UserInputService.TouchEnabled,
		Parent = gui,
	})

	-- Résultats
	resultsFrame = Ui.panel({
		Size = UDim2.fromOffset(520, 420),
		Position = UDim2.new(0.5, -260, 0.5, -200),
		Visible = false,
		Parent = gui,
	})

	toastHolder = Ui.new("Frame", {
		Size = UDim2.fromOffset(420, 200),
		Position = UDim2.new(0.5, -210, 0, 80),
		BackgroundTransparency = 1,
		Parent = gui,
	})
	Ui.list(Enum.FillDirection.Vertical, 6, Enum.HorizontalAlignment.Center).Parent = toastHolder
end

local function setRaceUiVisible(racing: boolean, spectating: boolean)
	instruments.Visible = racing
	compass.Visible = racing
	polarFrame.Visible = racing
	sailBar.Visible = racing
	controlsBar.Visible = racing
	helpLabel.Visible = racing and not UserInputService.TouchEnabled
	rankFrame.Visible = racing or spectating
end

local function showResults(payload: any)
	for _, c in resultsFrame:GetChildren() do
		if not c:IsA("UICorner") and not c:IsA("UIStroke") then
			c:Destroy()
		end
	end
	local results = payload.results
	if not results then
		resultsFrame.Visible = false
		return
	end
	resultsFrame.Visible = true
	Ui.padding(14).Parent = resultsFrame
	Ui.list(Enum.FillDirection.Vertical, 4).Parent = resultsFrame
	Ui.label({
		Size = UDim2.new(1, 0, 0, 34),
		Text = "🏁 " .. L("res_title"),
		TextSize = 26,
		Font = Enum.Font.GothamBlack,
		LayoutOrder = 0,
		Parent = resultsFrame,
	})
	local header = string.format("%-4s %-16s %-8s %-9s", "#", "", L("res_elapsed"), L("res_corrected"))
	Ui.label({
		Size = UDim2.new(1, 0, 0, 20),
		Text = header,
		TextSize = 13,
		TextColor3 = T.dim,
		Font = Enum.Font.Code,
		TextXAlignment = Enum.TextXAlignment.Left,
		LayoutOrder = 1,
		Parent = resultsFrame,
	})
	for i, r in results do
		if i > 12 then
			break
		end
		local boat = BoatClasses.get(r.boat)
		local name = string.sub(r.name, 1, 14) .. (if r.isBot then "" else " ★")
		local text = if r.finished
			then string.format(
				"%-4s %-16s %-8s %-9s",
				tostring(r.position),
				name,
				Ui.fmtTime(r.elapsed),
				Ui.fmtTime(r.corrected)
			)
			else string.format("%-4s %-16s %s", tostring(r.position), name, L("res_dnf"))
		local color = if r.id == RaceClient.myId then T.gold else T.text
		local line = Ui.label({
			Size = UDim2.new(1, 0, 0, 22),
			Text = text .. (if boat then "  " .. L(boat.nameKey) else ""),
			TextSize = 14,
			TextColor3 = color,
			Font = Enum.Font.Code,
			TextXAlignment = Enum.TextXAlignment.Left,
			LayoutOrder = 1 + i,
			Parent = resultsFrame,
		})
		if r.coins then
			line.Text ..= "  +" .. tostring(r.coins) .. "🪙"
		end
	end
end

local function updateProfile(p: any)
	coinsLabel.Text = "🪙 " .. Ui.fmtNumber(p.coins)
	local boat = BoatClasses.get(p.selectedBoat)
	levelLabel.Text = string.format("Niv. %d · %s", p.level, if boat then L(boat.nameKey) else "")
	autoJoinButton.Text = if p.autoJoin then "⛵ ON" else "👀 OFF"
	autoJoinButton.BackgroundColor3 = if p.autoJoin then T.good else T.panel2
end

local function drawPolar(
	boat: BoatClasses.BoatClass,
	ent: Polars.Entitlements,
	tws: number,
	twa: number,
	speed: number
)
	local maxV = 0.1
	local speeds = {}
	for i = 1, #polarDots do
		local a = (i - 1) / (#polarDots - 1) * 180
		local v = Polars.bestSpeed(boat, ent, a, tws)
		speeds[i] = v
		maxV = math.max(maxV, v)
	end
	maxV = math.max(maxV, speed)
	local R = 60
	local cx, cy = 20, 75
	for i, d in polarDots do
		local a = math.rad((i - 1) / (#polarDots - 1) * 180)
		local r = speeds[i] / maxV * R
		d.Position = UDim2.fromOffset(cx + math.sin(a) * r - 1, cy - math.cos(a) * r - 1)
	end
	local a = math.rad(math.abs(twa))
	local r = speed / maxV * R
	polarMe.Position = UDim2.fromOffset(cx + math.sin(a) * r - 4, cy - math.cos(a) * r - 4)
end

local polarTimer = 0

local function updateInstruments(dt: number)
	local s = RaceClient.myPredicted()
	local boat = RaceClient.myBoat()
	if not s or not boat then
		return
	end
	local ent = RaceClient.myEntitlements()
	speedLabel.Text = string.format("%.1f kn", s.speed)
	targetLabel.Text = L("hud_target", string.format("%.1f", s.target))
	rows.heading.Text = string.format("%03d°", math.floor(s.heading + 0.5) % 360)
	local twaAbs = math.abs(s.twa)
	rows.twa.Text = string.format("%s %d°", if s.twa >= 0 then "Tri" else "Bâb", math.floor(twaAbs + 0.5))
	rows.twa.TextColor3 = if twaAbs < 32 then T.bad else T.text
	rows.tws.Text = string.format("%.1f kn · %03d°", s.tws, math.floor(s.twd + 0.5) % 360)
	rows.vmg.Text = string.format("%.1f kn", Physics.vmg(s))

	local me = RaceClient.pose(RaceClient.myId)
	if me and me.ocs then
		statusLabel.Text = L("hud_ocs")
		statusLabel.TextColor3 = T.bad
	elseif s.maneuver > 0 then
		statusLabel.Text = L("hud_maneuver_" .. (if s.maneuverKind ~= "" then s.maneuverKind else "sail"))
			.. string.format(" %.0fs", s.maneuver)
		statusLabel.TextColor3 = T.gold
	elseif s.flying then
		statusLabel.Text = "🪽 " .. L("hud_flying")
		statusLabel.TextColor3 = T.good
	else
		statusLabel.Text = ""
	end
	local up, down = Autopilot.advice(boat, ent, s.tws)
	adviceLabel.Text = L("hud_best", math.floor(up + 0.5), math.floor(down + 0.5))

	-- rose des vents : angle du vent relatif au bateau
	windArrow.Rotation = s.twd - s.heading

	-- voiles
	local h = RaceClient.helm()
	for id, b in sailButtons do
		local sail = Sails.get(id) :: Sails.Sail
		local usable = Sails.canUse(sail, ent.sailPack)
		local eff = Sails.efficiency(sail, twaAbs, s.tws)
		if id == s.sail then
			b.BackgroundColor3 = T.accent
		elseif not usable then
			b.BackgroundColor3 = Color3.fromRGB(40, 40, 50)
		else
			b.BackgroundColor3 = if eff > 0.995 then Color3.fromRGB(30, 90, 60) else T.panel2
		end
		b.Text = (if usable then "" else "🔒")
			.. sail.short
			.. string.format("\n%d%%", math.floor(eff * 100))
	end
	autoButton.BackgroundColor3 = if h.autoSail and ent.autoSail then T.good else T.panel2
	autoButton.Text = (if ent.autoSail then "" else "🔒 ") .. L("hud_auto")
	modeButton.Text = if h.mode == "twa"
		then L("hud_mode_twa") .. string.format("\n%d°", math.floor(math.abs(h.value) + 0.5))
		else L("hud_mode_heading") .. string.format("\n%03d°", math.floor(h.value + 0.5) % 360)

	polarTimer += dt
	if polarTimer > 0.3 then
		polarTimer = 0
		drawPolar(boat, ent, s.tws, s.twa, s.speed)
	end
end

local function updateRanking()
	local ranking = RaceClient.ranking()
	for i, r in rankRows do
		local e = ranking[i]
		if e then
			local info = RaceClient.roster[e.id]
			local boat = info and BoatClasses.get(info.boat)
			r.Text = string.format(
				"%d. %s%s",
				i,
				if info then string.sub(info.name, 1, 14) else "?",
				if boat then " · " .. string.sub(L(boat.nameKey), 1, 8) else ""
			)
			r.TextColor3 = if e.id == RaceClient.myId
				then T.gold
				elseif e.pose.finished then T.good
				else T.text
		else
			r.Text = ""
		end
	end
end

local lastCount = -1

local function updateBanner()
	local s = RaceClient.state
	if not s then
		return
	end
	local remaining = s.phaseEnds - RaceClient.serverNow()
	local course = if s.courseId then Courses.get(s.courseId) else nil
	if s.phase == "intermission" then
		banner.Text = L("ph_intermission", Ui.fmtTime(remaining))
		subBanner.Text = L("game_title")
	elseif s.phase == "prestart" then
		banner.Text = L("ph_prestart", Ui.fmtTime(remaining))
		subBanner.Text = (if course then L(course.nameKey) else "")
			.. (if s.wind then string.format(" · %.0f kn", s.wind.tws) else "")
			.. (if s.allowOptions == false then " · " .. L("hud_fairplay") else "")
	elseif s.phase == "racing" then
		local elapsed = RaceClient.serverNow() - (s.gunTime or 0)
		banner.Text = L("ph_racing", Ui.fmtTime(elapsed))
		if not RaceClient.roster[RaceClient.myId] then
			subBanner.Text = L("ph_spectate")
		end
	else
		banner.Text = L("ph_results")
	end
	-- compte à rebours final
	local n = math.ceil(remaining)
	if s.phase == "prestart" and remaining <= 10 and remaining > 0 then
		countdown.Visible = true
		if n ~= lastCount then
			lastCount = n
			countdown.Text = tostring(n)
			countdown.TextSize = 140
			TweenService:Create(countdown, TweenInfo.new(0.6, Enum.EasingStyle.Quad), { TextSize = 90 })
				:Play()
		end
	elseif countdown.Text ~= L("n_start") then
		countdown.Visible = false
	end
end

function Hud.start()
	build()
	setRaceUiVisible(false, false)
	RaceClient.StateChanged:Connect(function(s)
		local mine = RaceClient.roster[RaceClient.myId] ~= nil
		local live = s.phase == "prestart" or s.phase == "racing"
		setRaceUiVisible(live and mine, live and not mine)
		if s.phase == "results" then
			showResults(s)
		else
			resultsFrame.Visible = false
		end
	end)
	RaceClient.ProfileChanged:Connect(updateProfile)
	if RaceClient.profile then
		updateProfile(RaceClient.profile)
	end
	RaceClient.Notify:Connect(Hud.toast)
	RaceClient.Event:Connect(function(e)
		if e.type == "gun" then
			countdown.Visible = true
			countdown.Text = L("n_start")
			countdown.TextSize = 120
			task.delay(1.5, function()
				if countdown.Text == L("n_start") then
					countdown.Visible = false
					countdown.Text = ""
				end
			end)
		elseif e.id == RaceClient.myId then
			if e.type == "mark" then
				Hud.toast("n_mark", { e.label })
			elseif e.type == "ocs" then
				Hud.toast("n_ocs")
			end
		end
	end)
	local rankTimer = 0
	RunService.RenderStepped:Connect(function(dt)
		updateBanner()
		if instruments.Visible then
			updateInstruments(dt)
		end
		rankTimer += dt
		if rankTimer > 0.5 and rankFrame.Visible then
			rankTimer = 0
			updateRanking()
		end
	end)
end

return Hud
