--!strict
-- Limiteur par joueur et par remote (seau à jetons).

local Players = game:GetService("Players")

local buckets: { [Player]: { [string]: { tokens: number, last: number } } } = {}

local RateLimit = {}

function RateLimit.allow(player: Player, key: string, ratePerSec: number, burst: number): boolean
	local now = os.clock()
	local pb = buckets[player]
	if not pb then
		pb = {}
		buckets[player] = pb
	end
	local b = pb[key]
	if not b then
		b = { tokens = burst, last = now }
		pb[key] = b
	end
	b.tokens = math.min(burst, b.tokens + (now - b.last) * ratePerSec)
	b.last = now
	if b.tokens < 1 then
		return false
	end
	b.tokens -= 1
	return true
end

Players.PlayerRemoving:Connect(function(player)
	buckets[player] = nil
end)

return RateLimit
