import { JobType } from "types/Job"
import { log } from "./log"

export const getEnergySinkTarget = (creep: Creep, room?: Room) => {
	if (creep.memory.job.type === JobType.Default) {
		log.debug(`${creep.name} searching for energy sinks on Default Job`)
	}
	if (!room) room = Game.rooms[creep.memory.job.roomName]
}

// Structure Type :: priority
export const ENERGY_SINKS = {
	extension: 1,
	tower: 2,
	spawn: 3,
	container: 4,
	storage: 10,
}

export function findEnergySinks(room: Room, filter?: any): [] {
	const sinks = room
		.find(FIND_STRUCTURES)
		.filter(
			(s) => Object.keys(ENERGY_SINKS).includes(s.structureType) && (filter ? filter(s) : true)
		)

	return sinks
}
