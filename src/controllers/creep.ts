import { doBuildingJob } from "jobs/builder"
import { doMinerJob } from "jobs/miner"
import { doUpgraderJob } from "jobs/upgrader"
import { DEFAULT_JOB, Job, JobType } from "types/Job"
import { CreepRole } from "types/memory"
import { log } from "utils/log"
//import { CreepRole } from "types/memory"

export function doJob(creep: Creep) {
	if (creep.memory.job.id === DEFAULT_JOB.id) findJob(creep)

	switch (creep.memory.job.type) {
		case JobType.Mining:
			doMinerJob(creep)
			break
		case JobType.Upgrading:
			doUpgraderJob(creep)
			break
		case JobType.Building:
			doBuildingJob(creep)
			break
		default:
			log.warn(
				`controllers:creep:doJob:20 - default case hit in switch statement - Creep ${creep.name} has no job`
			)
	}
}

export function findJob(creep: Creep, room?: Room) {
	if (!room) room = creep.room
	log.debug(`${creep.name} trying to find job - role ${creep.memory.role}`)
	// Find all unclaimed jobs for this role and take the first one
	const job = findJobsByRole(room, creep.memory.role).filter((job) => job.claimedBy === null)[0]

	if (job.type === "Default") {
		log.error("Found default job in job board: ", JSON.stringify(job))
		return
	}

	room.memory.jobs[job.type][job.id].claimedBy = creep.id

	job.claimedBy = creep.id
	creep.memory.job = job
}

function findJobsByRole(room: Room, role: keyof typeof CreepRole): Job[] {
	if (!room.memory.jobs) {
		log.info(`FindJobsByRole - ERROR: Room ${room.name} does not have job board set!`)
		return []
	}

	const jobs = room.memory.jobs

	switch (role) {
		case CreepRole.All:
			return [
				...Object.values(jobs[JobType.Mining]),
				...Object.values(jobs[JobType.Building]),
				...Object.values(jobs[JobType.Upgrading]),
			] as Job[]
		case CreepRole.Miner:
			return Object.values(jobs[JobType.Mining])
		case CreepRole.Upgrader:
			return Object.values(jobs[JobType.Upgrading])
		case CreepRole.Builder:
			return Object.values(jobs[JobType.Building])
		case CreepRole.Hauler:
			return Object.values(jobs[JobType.Hauling])
		default:
			return []
	}
}

// function findEnergySources(room: Room, filter?: any) {
// 	let sources = room
// 		.find(FIND_STRUCTURES)
// 		.filter(
// 			(s) =>
// 				(s.structureType === "spawn" ||
// 					s.structureType === "container" ||
// 					s.structureType === "extension" ||
// 					s.structureType === "storage") &&
// 				(filter?.(s) ?? true)
// 		)

// 	return sources
// }

// interface EnergySinkProps {
// 	filter?(s: any): boolean
// 	refresh?: boolean
// }

// function getNextEnergySink(creep: Creep, props?: EnergySinkProps): boolean {
// 	if (!creep.memory.job) return false

// 	let refresh = false
// 	if (props) refresh = props.refresh ?? false

// 	if (!creep.memory.job.targets || (creep.memory.job.targets.length === 0 && refresh)) {
// 		creep.memory.job.targets = findEnergySinks(creep.room, props?.filter)
// 		if (creep.memory.job.targets.length === 0) return false
// 	}

// 	let target = creep.pos.findClosestByRange(
// 		creep.memory.job.targets.filter((s) => (props?.filter ? props.filter(s) : true))
// 	)
// 	creep.memory.job.targets.shift()

// 	if (target) creep.memory.job.target = target
// 	else creep.memory.job.target = undefined

// 	return true
// }

// function getStructure(creep: Creep, types: StructureConstant[]) {}

// function getNextEnergySource(creep: Creep, props?: EnergySinkProps): boolean {
// 	if (!creep.memory.job) return false

// 	let refresh = false
// 	if (props) refresh = props.refresh ?? false

// 	if (!creep.memory.job.targets || (creep.memory.job.targets.length === 0 && refresh)) {
// 		creep.memory.job.targets = findEnergySources(creep.room, props?.filter)
// 		if (creep.memory.job.targets.length === 0) return false
// 	}

// 	let target = creep.pos.findClosestByRange(
// 		creep.memory.job.targets.filter((s) => (props?.filter ? props.filter(s) : true))
// 	)
// 	creep.memory.job.targets.shift()

// 	if (target) creep.memory.job.target = target
// 	else creep.memory.job.target = undefined

// 	return true
// }

// const EnergySources = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_CONTAINER, STRUCTURE_STORAGE]
// const EnergySink = [
// 	STRUCTURE_EXTENSION,
// 	STRUCTURE_SPAWN,
// 	STRUCTURE_STORAGE,
// 	STRUCTURE_TOWER,
// 	STRUCTURE_CONTAINER,
// ]
