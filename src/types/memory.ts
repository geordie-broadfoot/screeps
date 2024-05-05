import { BuildingJob, HaulingJob, Job, JobType, MiningJob, UpgradingJob } from "types/Job"
import { HeatMap } from "utils/heatMap"

export interface _CreepMemory {
	role: keyof typeof CreepRole
	job: Job
	room: string
}

export interface _RoomMemory {
	heatMap: HeatMap[]
	jobs: JobList
	buildOrders: string[]
	roadPlanner: RoomPosition[]
	sources: MiningSpot[]
	energyReservations: {
		[sinkId: string]: {
			[creepId: string]: number
		}
	}
}

export enum CreepRole {
	All = "All",
	Miner = "Miner",
	Hauler = "Hauler",
	Fighter = "Fighter",
	Upgrader = "Upgrader",
	Builder = "Builder",
}

export interface JobList {
	[JobType.Mining]: { [index: string]: MiningJob }
	[JobType.Upgrading]: { [index: string]: UpgradingJob }
	[JobType.Building]: { [index: string]: BuildingJob }
	[JobType.Hauling]: { [index: string]: HaulingJob }
}

export interface MiningSpot {
	sourceId: string
	pos: RoomPosition
	spots: RoomPosition[]
	hasDedicatedMiner: boolean
	hasContainer: boolean
	containerId: string
}
