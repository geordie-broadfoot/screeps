export type JobType = "Mining" | "Hauling" | "Building" | "Upgrading"

/*
export interface Job {
	id: string
	roomName: string
	type: JobType
	status: string
	description: string
	source?: Source | AnyOwnedStructure | ConstructionSite
	target?: AnyStructure
	targets?: AnyStructure[]
	controller?: StructureController
	site?: ConstructionSite
	dest?: RoomPosition
	spawn?: StructureSpawn
	path?: any
}
*/

export type Job = MiningJob | HaulingJob | BuildingJob | UpgradingJob

type BaseJob = {
	id: string
	description?: string
	type: JobType
	path?: any
	status: "init" | "loading" | "unloading"
  roomName: string
  sourceId: string
  destinationId: string
}

type MiningJob = BaseJob & {
	type: "Mining"
}

type HaulingJob = BaseJob & {
	type: "Hauling"
}

type BuildingJob = BaseJob & {
	type: "Building"
}

type UpgradingJob = BaseJob & {
	type: "Upgrading"
}
