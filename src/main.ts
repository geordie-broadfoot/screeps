import { doJob, handleDeadCreep } from "controllers/creep"
import { processRoom } from "controllers/room"
import { ErrorMapper } from "utils/ErrorMapper"
import { CreepRole, _CreepMemory, _RoomMemory } from "./types/memory"
import { log } from "utils/log"
import { updateHeatMap } from "utils/heatMap"
declare global {
	// export interface Memory extends _Memory {}
	export interface CreepMemory extends _CreepMemory {}
	export interface RoomMemory extends _RoomMemory {}

	// Syntax for adding proprties to `global` (ex "global.log")
	namespace NodeJS {
		interface Global {
			uuid(): string
		}
	}
}

// Start of core loop
export const loop = ErrorMapper.wrapLoop(() => {
	global.uuid = () => {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
			const r = (Math.random() * 16) | 0,
				v = c == "x" ? r : (r & 0x3) | 0x8
			return v.toString(16)
		})
	}
	if (Game.time % 10 === 0) log.info(`Current game tick is ${Game.time}`)

	const roomProps = { creepLimit: 9 }

	let creeps: Creep[] = []
	// Automatically delete memory of missing creeps
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			handleDeadCreep(Memory.creeps[name])
			delete Memory.creeps[name]
		} else creeps.push(Game.creeps[name])
	}

	_.forEach(Game.rooms, (r) => {
		processRoom(r, roomProps)
	})
	creeps = _.sortBy(creeps, (c) => {
		return CreepRole[c.memory.role]
	}).reverse()

	_.forEach(creeps, (c) => {
		try {
			updateHeatMap(c)
			doJob(c)
		} catch (e) {
			log.error(
				c.name,
				" encountered a problem while doing its " +
					c.memory.job?.type +
					" job: " +
					ErrorMapper.sourceMappedStackTrace(new Error((e as any).toString()))
			)
		}
	})
})
