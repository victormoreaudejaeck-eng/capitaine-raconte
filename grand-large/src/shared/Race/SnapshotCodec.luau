--!strict
-- Encodage binaire des positions de la flotte (17 octets par bateau).
-- Les UnreliableRemoteEvent sont limités à ~900 octets : 12 bateaux ≈ 205 octets.

export type Entry = {
	index: number, -- position dans la liste triée des concurrents (1..255)
	x: number,
	y: number,
	heading: number,
	speed: number,
	sail: number, -- index dans Sails.LIST
	flags: number, -- 1 manœuvre · 2 en vol · 4 OCS · 8 arrivé
	nextCp: number,
	maneuver: number, -- secondes restantes
}

local SIZE = 17

local Codec = {}

function Codec.encode(entries: { Entry }): buffer
	local b = buffer.create(#entries * SIZE)
	for i, e in entries do
		local o = (i - 1) * SIZE
		buffer.writeu8(b, o, math.clamp(e.index, 0, 255))
		buffer.writef32(b, o + 1, e.x)
		buffer.writef32(b, o + 5, e.y)
		buffer.writeu16(b, o + 9, math.clamp(math.floor(e.heading * 100 + 0.5), 0, 65535))
		buffer.writeu16(b, o + 11, math.clamp(math.floor(e.speed * 100 + 0.5), 0, 65535))
		buffer.writeu8(b, o + 13, math.clamp(e.sail, 0, 255))
		buffer.writeu8(b, o + 14, math.clamp(e.flags, 0, 255))
		buffer.writeu8(b, o + 15, math.clamp(e.nextCp, 0, 255))
		buffer.writeu8(b, o + 16, math.clamp(math.floor(e.maneuver * 10 + 0.5), 0, 255))
	end
	return b
end

function Codec.decode(b: buffer): { Entry }
	local out: { Entry } = {}
	local n = buffer.len(b) // SIZE
	for i = 1, n do
		local o = (i - 1) * SIZE
		table.insert(out, {
			index = buffer.readu8(b, o),
			x = buffer.readf32(b, o + 1),
			y = buffer.readf32(b, o + 5),
			heading = buffer.readu16(b, o + 9) / 100,
			speed = buffer.readu16(b, o + 11) / 100,
			sail = buffer.readu8(b, o + 13),
			flags = buffer.readu8(b, o + 14),
			nextCp = buffer.readu8(b, o + 15),
			maneuver = buffer.readu8(b, o + 16) / 10,
		})
	end
	return out
end

return Codec
