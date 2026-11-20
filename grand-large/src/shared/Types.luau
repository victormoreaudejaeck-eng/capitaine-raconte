--!strict
-- Types qui traversent la frontière client/serveur.

export type Stats = {
	races: number,
	wins: number,
	podiums: number,
	bestTimes: { [string]: number }, -- par parcours, temps compensé
}

export type Profile = {
	version: number,
	coins: number,
	xp: number,
	boats: { [string]: boolean },
	options: { [string]: boolean }, -- options achetées en pièces
	selectedBoat: string,
	stats: Stats,
	settings: { autoJoin: boolean },
	receipts: { string }, -- derniers PurchaseId traités (anti-doublon)
}

-- Vue envoyée au client (jamais lue en retour par le serveur).
export type PublicProfile = {
	coins: number,
	xp: number,
	level: number,
	boats: { [string]: boolean },
	options: { [string]: boolean }, -- possédées (pièces OU game pass)
	selectedBoat: string,
	stats: Stats,
	autoJoin: boolean,
	gamePassesEnabled: { [string]: boolean }, -- options vendues en Robux dans ce jeu
	productsEnabled: { [string]: boolean },
}

export type RacerInfo = {
	id: string,
	name: string,
	boat: string,
	isBot: boolean,
	userId: number,
	options: { foils: boolean, sailPack: boolean, proWinches: boolean, autoSail: boolean },
}

export type Phase = "intermission" | "prestart" | "racing" | "results"

export type ResultRow = {
	id: string,
	name: string,
	boat: string,
	isBot: boolean,
	finished: boolean,
	elapsed: number,
	corrected: number,
	position: number,
	coins: number?,
}

export type RaceStatePayload = {
	phase: Phase,
	phaseEnds: number, -- temps serveur (workspace:GetServerTimeNow)
	courseId: string?,
	wind: any?, -- WindSpec
	origin: { number }?,
	scale: number?,
	gunTime: number?,
	allowOptions: boolean?,
	racers: { RacerInfo }?,
	results: { ResultRow }?,
}

return nil
