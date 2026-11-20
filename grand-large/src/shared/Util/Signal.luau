--!strict
-- Signal minimal (connexion / déconnexion / déclenchement).

export type Connection = { Disconnect: (self: Connection) -> () }
export type Signal<T...> = {
	Connect: (self: Signal<T...>, fn: (T...) -> ()) -> Connection,
	Fire: (self: Signal<T...>, T...) -> (),
}

local Signal = {}

function Signal.new<T...>(): Signal<T...>
	local handlers: { [number]: (T...) -> () } = {}
	local nextId = 0
	local self = {}
	function self.Connect(_: any, fn: (T...) -> ()): Connection
		nextId += 1
		local id = nextId
		handlers[id] = fn
		return {
			Disconnect = function()
				handlers[id] = nil
			end,
		} :: any
	end
	function self.Fire(_: any, ...: T...)
		for _, fn in handlers do
			task.spawn(fn, ...)
		end
	end
	return self :: any
end

return Signal
