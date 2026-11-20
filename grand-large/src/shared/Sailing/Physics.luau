--!strict
-- Simulation d'un bateau, pas fixe, 100 % déterministe.
-- Exécutée par le serveur (autorité), par le client (prédiction) et par les tests.

local Config = require(script.Parent.Parent.Config)
local Angles = require(script.Parent.Parent.Util.Angles)
local BoatClasses = require(script.Parent.BoatClasses)
local Sails = require(script.Parent.Sails)
local Polars = require(script.Parent.Polars)
local Wind = require(script.Parent.Wind)

type BoatClass = BoatClasses.BoatClass
type Entitlements = Polars.Entitlements

export type HelmMode = "heading" | "twa"

export type Helm = {
	mode: HelmMode,
	value: number, -- cap visé (mode heading) ou TWA signé visé (mode twa)
	sail: string, -- voile demandée
	autoSail: boolean, -- demande l'auto-voiles (effectif seulement si l'option est possédée)
}

export type BoatState = {
	x: number,
	y: number,
	heading: number,
	speed: number, -- nœuds
	twa: number, -- dernier TWA signé
	tws: number,
	twd: number,
	sail: string,
	maneuver: number, -- secondes de pénalité restantes
	maneuverKind: string, -- "tack" | "gybe" | "sail" | ""
	flying: boolean,
	target: number, -- vitesse cible (nœuds), utile au HUD
}

export type StepEvent = "tack" | "gybe" | "sail"

local Physics = {}

function Physics.newState(x: number, y: number, heading: number): BoatState
	return {
		x = x,
		y = y,
		heading = Angles.wrap360(heading),
		speed = 0,
		twa = 0,
		tws = 0,
		twd = 0,
		sail = Sails.DEFAULT,
		maneuver = 0,
		maneuverKind = "",
		flying = false,
		target = 0,
	}
end

function Physics.newHelm(heading: number): Helm
	return { mode = "heading", value = Angles.wrap360(heading), sail = Sails.DEFAULT, autoSail = true }
end

function Physics.copyState(s: BoatState): BoatState
	return table.clone(s)
end

local function startManeuver(state: BoatState, seconds: number, kind: string)
	if seconds > state.maneuver then
		state.maneuver = seconds
		state.maneuverKind = kind
	end
end

-- Avance la simulation de dt secondes. Renvoie l'événement de manœuvre éventuel.
function Physics.step(
	state: BoatState,
	helm: Helm,
	boat: BoatClass,
	ent: Entitlements,
	wind: Wind.WindSpec,
	t: number,
	dt: number
): StepEvent?
	local event: StepEvent? = nil
	local twd, tws = Wind.sample(wind, state.x, state.y, t)
	state.twd, state.tws = twd, tws

	-- 1. Barre : on tourne vers le cap désiré à vitesse limitée par le bateau.
	local desired = if helm.mode == "twa" then Angles.headingFromTwa(twd, helm.value) else helm.value
	local maxTurn = boat.turnRate * dt
	local turn = Angles.clamp(Angles.diff(state.heading, desired), -maxTurn, maxTurn)
	state.heading = Angles.wrap360(state.heading + turn)

	-- 2. Virement / empannage : le vent change de bord.
	local twa = Angles.twa(twd, state.heading)
	local prev = state.twa
	if prev ~= 0 and Angles.sign(twa) ~= Angles.sign(prev) and math.abs(twa) > 0.2 then
		local winch = if ent.proWinches then Config.PRO_WINCH_TIME_FACTOR else 1
		if math.abs(twa) < 90 then
			startManeuver(state, boat.tackTime * winch, "tack")
			event = "tack"
		else
			startManeuver(state, boat.gybeTime * winch, "gybe")
			event = "gybe"
		end
	end
	state.twa = twa
	local twaAbs = math.abs(twa)

	-- 3. Voiles.
	local wanted: Sails.Sail? = nil
	if helm.autoSail and ent.autoSail then
		wanted = Sails.best(twaAbs, tws, ent.sailPack)
	else
		local s = Sails.get(helm.sail)
		if s and Sails.canUse(s, ent.sailPack) then
			wanted = s
		end
	end
	if wanted and wanted.id ~= state.sail then
		state.sail = wanted.id
		local winch = if ent.proWinches then Config.PRO_WINCH_TIME_FACTOR else 1
		startManeuver(state, boat.sailChangeTime * winch, "sail")
		event = event or "sail"
	end

	-- 4. Vitesse cible et inertie.
	local sail = Sails.get(state.sail) or (Sails.get(Sails.DEFAULT) :: Sails.Sail)
	local target, flying = Polars.speedWithSail(boat, ent, sail, twaAbs, tws)
	if state.maneuver > 0 then
		target *= Config.MANEUVER_SPEED_FACTOR
	end
	state.target = target
	state.flying = flying and state.speed > target * 0.75
	local dv = target - state.speed
	if dv > 0 then
		state.speed = math.min(target, state.speed + boat.accel * dt)
	else
		state.speed = math.max(target, state.speed - boat.decel * dt)
	end

	-- 5. Déplacement.
	local dx, dy = Angles.dir(state.heading)
	local dist = state.speed * Config.STUDS_PER_KNOT * dt
	state.x += dx * dist
	state.y += dy * dist

	state.maneuver = math.max(0, state.maneuver - dt)
	if state.maneuver == 0 then
		state.maneuverKind = ""
	end
	return event
end

-- VMG (vitesse utile face au vent, positive au près ou au portant).
function Physics.vmg(state: BoatState): number
	return state.speed * math.abs(math.cos(math.rad(state.twa)))
end

return Physics
