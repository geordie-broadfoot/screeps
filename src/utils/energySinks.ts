import { JobType } from "types/Job"
import { log } from "./log"

export const getEnergySinkTarget = (creep: Creep, room?: Room) => {
	if (creep.memory.job.type === JobType.Default) {
		log.debug(`${creep.name} searching for energy sinks on Default Job`)
	}
	if (!room) room = Game.rooms[creep.memory.job.roomName]

	const extensions = room.find(FIND_MY_STRUCTURES, {
		filter: { structureType: STRUCTURE_EXTENSION },
	})
}
