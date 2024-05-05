export const JobType = {
	Default: "Default" as const,
	Mining: "Mining" as const,
	Building: "Building" as const,
	Upgrading: "Upgrading" as const,
	Hauling: "Hauling" as const,
}

export type Job = DefaultJob | MiningJob | HaulingJob | BuildingJob | UpgradingJob

type BaseJob = {
	id: string
	description?: string
	path?: any
	roomName: string
	claimedBy: string | null
}

export const DEFAULT_JOB: DefaultJob = {
	id: "default-job-id",
	description: "default-job",
	roomName: "default-job",
	claimedBy: null,
	type: JobType.Default,
}

export type DefaultJob = BaseJob & {
	type: typeof JobType.Default
}

export type MiningJob = BaseJob & {
	type: typeof JobType.Mining
	sourceId: Id<Source>
	status: "init" | "mining" | "unloading" | "overflow"
}

export type HaulingJob = BaseJob & {
	type: typeof JobType.Hauling
	status: "init" | "pick-up" | "unloading" | "overflow"
}

export type BuildingJob = BaseJob & {
	type: typeof JobType.Building
	status: "init" | "loading" | "building"
}

export type UpgradingJob = BaseJob & {
	type: typeof JobType.Upgrading
	status: "init" | "loading" | "upgrading"
	controllerId: Id<StructureController>
}
