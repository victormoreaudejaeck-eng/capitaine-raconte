--!strict
-- Petits utilitaires pour construire l'interface en code.

local Ui = {}

Ui.Theme = {
	bg = Color3.fromRGB(10, 24, 40),
	panel = Color3.fromRGB(14, 34, 56),
	panel2 = Color3.fromRGB(22, 50, 80),
	accent = Color3.fromRGB(0, 190, 255),
	gold = Color3.fromRGB(255, 196, 40),
	good = Color3.fromRGB(70, 220, 120),
	bad = Color3.fromRGB(255, 80, 80),
	text = Color3.fromRGB(240, 248, 255),
	dim = Color3.fromRGB(150, 175, 200),
	robux = Color3.fromRGB(0, 176, 111),
}

function Ui.new(className: string, props: { [string]: any }?, children: { any }?): any
	local inst = Instance.new(className)
	if props then
		for k, v in props do
			if k ~= "Parent" then
				(inst :: any)[k] = v
			end
		end
	end
	if children then
		for _, c in children do
			c.Parent = inst
		end
	end
	if props and props.Parent then
		inst.Parent = props.Parent
	end
	return inst
end

function Ui.corner(radius: number?): UICorner
	return Ui.new("UICorner", { CornerRadius = UDim.new(0, radius or 10) })
end

function Ui.stroke(color: Color3?, thickness: number?, transparency: number?): UIStroke
	return Ui.new("UIStroke", {
		Color = color or Color3.new(1, 1, 1),
		Thickness = thickness or 1,
		Transparency = transparency or 0.75,
		ApplyStrokeMode = Enum.ApplyStrokeMode.Border,
	})
end

function Ui.padding(px: number): UIPadding
	local u = UDim.new(0, px)
	return Ui.new("UIPadding", { PaddingLeft = u, PaddingRight = u, PaddingTop = u, PaddingBottom = u })
end

function Ui.list(
	direction: Enum.FillDirection?,
	spacing: number?,
	align: Enum.HorizontalAlignment?
): UIListLayout
	return Ui.new("UIListLayout", {
		FillDirection = direction or Enum.FillDirection.Vertical,
		Padding = UDim.new(0, spacing or 6),
		SortOrder = Enum.SortOrder.LayoutOrder,
		HorizontalAlignment = align or Enum.HorizontalAlignment.Left,
	})
end

function Ui.panel(props: { [string]: any }): Frame
	local p = table.clone(props)
	p.BackgroundColor3 = p.BackgroundColor3 or Ui.Theme.panel
	p.BackgroundTransparency = p.BackgroundTransparency or 0.15
	p.BorderSizePixel = 0
	local f = Ui.new("Frame", p, { Ui.corner(12) :: Instance, Ui.stroke(Ui.Theme.accent, 1, 0.7) })
	return f
end

function Ui.label(props: { [string]: any }): TextLabel
	local p = table.clone(props)
	p.BackgroundTransparency = p.BackgroundTransparency or 1
	p.Font = p.Font or Enum.Font.GothamBold
	p.TextColor3 = p.TextColor3 or Ui.Theme.text
	p.TextSize = p.TextSize or 16
	p.BorderSizePixel = 0
	return Ui.new("TextLabel", p)
end

function Ui.button(props: { [string]: any }, onClick: (() -> ())?): TextButton
	local p = table.clone(props)
	p.BackgroundColor3 = p.BackgroundColor3 or Ui.Theme.panel2
	p.Font = p.Font or Enum.Font.GothamBold
	p.TextColor3 = p.TextColor3 or Ui.Theme.text
	p.TextSize = p.TextSize or 16
	p.AutoButtonColor = true
	p.BorderSizePixel = 0
	local b = Ui.new("TextButton", p, { Ui.corner(8) })
	if onClick then
		b.Activated:Connect(onClick)
	end
	return b
end

function Ui.fmtTime(seconds: number): string
	seconds = math.max(0, seconds)
	local m = math.floor(seconds / 60)
	local s = math.floor(seconds % 60)
	return string.format("%d:%02d", m, s)
end

function Ui.fmtNumber(n: number): string
	local s = tostring(math.floor(n))
	local out = s:reverse():gsub("(%d%d%d)", "%1 "):reverse()
	return (out:gsub("^ ", ""))
end

return Ui
