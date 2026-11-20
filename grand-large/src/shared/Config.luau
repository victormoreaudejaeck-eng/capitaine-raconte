--!strict
-- Réglages de gameplay. ATTENTION : répliqué aux clients, rien de secret ici,
-- et le serveur ne fait jamais confiance à une valeur envoyée par un client.

local Config = {
	-- Échelle : 1 nœud de vitesse bateau = STUDS_PER_KNOT studs/seconde.
	STUDS_PER_KNOT = 2.2,

	-- Simulation (identique serveur / client / tests)
	SIM_DT = 0.1, -- pas fixe en secondes (10 Hz)
	SNAPSHOT_RATE = 10, -- envois d'état par seconde

	-- Pénalités de manœuvre : vitesse cible multipliée par ce facteur pendant la manœuvre
	MANEUVER_SPEED_FACTOR = 0.62,
	PRO_WINCH_TIME_FACTOR = 0.55, -- option "Winchs Pro" : durée des manœuvres ×0,55

	-- Course
	MAX_RACERS = 12,
	MIN_FLEET = 6, -- on complète avec des bots jusqu'à ce nombre
	INTERMISSION = 25,
	PRESTART = 45,
	RACE_TIMEOUT = 900,
	AFTER_FIRST_FINISH = 150, -- temps laissé aux autres après le premier arrivé
	RESULTS = 15,

	-- Monde
	WATER_LEVEL = 0,
	OCEAN_HALF_SIZE = 3584, -- demi-côté de la zone d'eau (studs)
	DOCK_POSITION = { x = -520, y = -620 }, -- ponton du lobby (repère carte)

	-- Récompenses
	REWARD_FINISH = 60,
	REWARD_PER_BOAT_BEATEN = 18,
	REWARD_WIN_BONUS = 120,
	REWARD_DNF = 10,
	VIP_COIN_MULTIPLIER = 2,

	-- Données
	AUTOSAVE_INTERVAL = 60,
	DATASTORE_NAME = "GrandLarge_Profiles_v1",
}

return table.freeze(Config)
