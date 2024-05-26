import { CreepRole } from "types/memory"
import { setRoomMiningSpots } from "utils/miningSpot"
import { processTowers } from "./tower"
import { BuildingJob, DEFAULT_JOB, Job, JobType, MiningJob, UpgradingJob } from "types/Job"
import { createHeatMap, printHeatMapToTerminal } from "utils/heatMap"
import { log } from "utils/log"
import { getCreepBody } from "consts/creepBodies"
import { getError } from "consts/errors"

export function processRoom(room: Room, roomProps: any) {
	// Init
	{
		if (!room.memory.sources) setRoomMiningSpots(room)

		if (!room.memory.heatMap) createHeatMap(room)

		if (!room.memory.jobs)
			room.memory.jobs = {
				[JobType.Mining]: createMiningJobs(room),
				[JobType.Building]: createBuildJobs(room),
				[JobType.Upgrading]: createUpgradingJobs(room),
				[JobType.Hauling]: {},
			}
	}

	checkForCompletedStructures(room)

	const creeps = room.find(FIND_MY_CREEPS)
	const spawns = room.find(FIND_MY_SPAWNS)
	const extensions = room.find(FIND_STRUCTURES, {
		filter: { structureType: "extension" },
	}) as StructureExtension[]

	_.forEach(spawns, (spawn) => {
		// Spawn New Creeps
		if (spawn.spawning) return

		let roomEnergy = spawn.store.energy
		_.forEach(extensions, (e) => (roomEnergy += e.store.energy))

		// log.info(
		// 	`energy: ${roomEnergy}/${
		// 		spawns.length * SPAWN_ENERGY_CAPACITY +
		// 		extensions.length * EXTENSION_ENERGY_CAPACITY[room.controller?.level ?? 0]
		// 	} `
		// )
		if (roomEnergy < 300) return // Not enough energy to spawn something

		if (creeps.length < roomProps.creepLimit) {
			const num = Math.floor(Math.random() * 1000)
			let role = CreepRole.All
			if (
				creeps.length > 8 &&
				_.filter(creeps, (c) => c.memory.role === CreepRole.Upgrader).length < roomProps.upgraders
			) {
				role = CreepRole.All
			}

			const creepBody = getCreepBody(roomEnergy, role)
			const s = spawn.spawnCreep(creepBody, "Creep" + num, {
				memory: { role: role as keyof typeof CreepRole, room: spawn.room.name, job: DEFAULT_JOB },
			})

			if (s !== OK) {
				log.warn("Spawn creep result code: " + getError(s) + " " + creepBody)
			}
		}
	})

	processTowers(room)
	//   if (Game.time % 150 === 0) pruneHeatMap(room)
	if (Game.time % 10 === 0) printHeatMapToTerminal(room)
	//   if (room.memory.roadPlanner)
	//     _.forEach(room.memory.roadPlanner, p => room.visual.circle(p))
}

/**
 * Creates a job posting for every 'plain' tile adjacent to every source in the given room
 */
const createMiningJobs = (room: Room): { [index: string]: MiningJob } => {
	const sources = room.find(FIND_SOURCES)

	const jobs: { [index: string]: MiningJob } = {}

	for (const source of sources) {
		const { x, y } = source.pos
		const terrain = source.room.lookForAtArea(LOOK_TERRAIN, y - 1, x - 1, y + 1, x + 1, true)

		const spaces = _.filter(terrain, (t) => t.terrain === "plain").length

		for (let i = 0; i < spaces; i++) {
			const id = global.uuid()
			jobs[id] = {
				id,
				status: "init",
				sourceId: source.id,
				description: "energy",
				roomName: source.room.name,
				type: JobType.Mining,
				claimedBy: null,
			}
		}
	}

	return jobs
}

/**
 * Creates a job posting for every 'plain' tile adjacent to the controller
 */
const createUpgradingJobs = (room: Room): { [index: string]: UpgradingJob } => {
	const controller = room.controller
	const jobs: { [index: string]: UpgradingJob } = {}

	if (!controller) return jobs

	const { x, y } = controller.pos
	const terrain = controller.room.lookForAtArea(LOOK_TERRAIN, y - 1, x - 1, y + 1, x + 1, true)
	const spaces = _.filter(terrain, (t) => t.terrain === "plain").length

	for (let i = 0; i < spaces; i++) {
		const id = global.uuid()
		jobs[id] = {
			id,
			status: "init",
			controllerId: controller.id,
			description: "Upgrading controller",
			roomName: controller.room.name,
			type: JobType.Upgrading,
			claimedBy: null,
		}
	}

	return jobs
}

/**
 * Scans a room for all planned constructions and creates a job for each one
 */
function createBuildJobs(room: Room): { [index: string]: BuildingJob } {
	const sites = room.find(FIND_CONSTRUCTION_SITES)
	const jobs: { [index: string]: BuildingJob } = {}
	//log.info("found", sites.length, "build jobs")
	_.forEach(sites, (s) => {
		if (!room.memory.buildOrders?.includes(s.id)) {
			const job: BuildingJob = {
				id: global.uuid(),
				type: JobType.Building,
				status: "init",
				description: "Build " + s.structureType,
				roomName: room.name,
				claimedBy: null,
			}
			//room.memory.buildOrders?.push(s.id)
			jobs[job.id] = job
		}
	})

	return jobs
}

/**
 * Checks for when structures are finished construction. Relevant structures will be added to the rooms memory
 */
function checkForCompletedStructures(room: Room) {
	const buildEvents = room.getEventLog().filter((event) => event.event === EVENT_BUILD)

	for (const event of buildEvents) {
		event.event
	}
}
