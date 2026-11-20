--!strict
-- Bruit déterministe (identique sur serveur, client et tests Lune).
-- On n'utilise pas math.noise pour pouvoir tester hors Roblox et garantir
-- que client et serveur calculent exactement le même vent.

local Noise = {}

local TWO32 = 4294967296

-- Multiplication modulo 2^32 sans perte de précision (les nombres Luau sont des doubles).
local function mul32(a: number, b: number): number
	local aHi = bit32.rshift(a, 16)
	local aLo = bit32.band(a, 0xFFFF)
	return ((aHi * b % 65536) * 65536 + aLo * b) % TWO32
end

local function hash3(ix: number, iy: number, iz: number, seed: number): number
	local h = bit32.bxor(
		mul32(ix % TWO32, 0x8DA6B343),
		mul32(iy % TWO32, 0xD8163841),
		mul32(iz % TWO32, 0xCB1AB31F),
		mul32(seed % TWO32, 0x9E3779B1)
	)
	h = bit32.bxor(h, bit32.rshift(h, 15))
	h = mul32(h, 0x2C1B3C6D)
	h = bit32.bxor(h, bit32.rshift(h, 12))
	h = mul32(h, 0x297A2D39)
	h = bit32.bxor(h, bit32.rshift(h, 15))
	return h / TWO32 -- [0, 1)
end

local function fade(t: number): number
	return t * t * (3 - 2 * t)
end

-- Bruit de valeur 3D lissé, résultat dans [-1, 1].
function Noise.noise3(x: number, y: number, z: number, seed: number): number
	local x0, y0, z0 = math.floor(x), math.floor(y), math.floor(z)
	local fx, fy, fz = fade(x - x0), fade(y - y0), fade(z - z0)

	local function v(dx: number, dy: number, dz: number): number
		return hash3(x0 + dx, y0 + dy, z0 + dz, seed)
	end

	local x00 = v(0, 0, 0) + (v(1, 0, 0) - v(0, 0, 0)) * fx
	local x10 = v(0, 1, 0) + (v(1, 1, 0) - v(0, 1, 0)) * fx
	local x01 = v(0, 0, 1) + (v(1, 0, 1) - v(0, 0, 1)) * fx
	local x11 = v(0, 1, 1) + (v(1, 1, 1) - v(0, 1, 1)) * fx
	local y0v = x00 + (x10 - x00) * fy
	local y1v = x01 + (x11 - x01) * fy
	return (y0v + (y1v - y0v) * fz) * 2 - 1
end

-- Bruit fractal (2 octaves) : plus naturel pour le vent.
function Noise.fbm3(x: number, y: number, z: number, seed: number): number
	return (Noise.noise3(x, y, z, seed) * 0.7 + Noise.noise3(x * 2.03, y * 2.03, z * 2.03, seed + 17) * 0.3)
end

-- Aléatoire déterministe simple (pour les bots, les tirages de course…).
export type Rng = {
	next: (self: Rng) -> number,
	range: (self: Rng, lo: number, hi: number) -> number,
	state: number,
}

function Noise.rng(seed: number): Rng
	local self = { state = seed % TWO32 }
	function self.next(r: Rng): number
		r.state = (mul32(r.state, 1664525) + 1013904223) % TWO32
		return r.state / TWO32
	end
	function self.range(r: Rng, lo: number, hi: number): number
		return lo + (hi - lo) * r:next()
	end
	return (self :: any) :: Rng
end

return Noise
