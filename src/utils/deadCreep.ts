import { DEFAULT_JOB } from "types/Job"

export function handleDeadCreep(creep: CreepMemory) {
	releaseJob(creep)
}

export function releaseJob(creepMemory: CreepMemory) {
	const job = creepMemory.job

	if (job.type === DEFAULT_JOB.type) return

	const room = Game.rooms[job.roomName]
	// Push creep's job back into array for that type
	room.memory.jobs[job.type][job.id].claimedBy = null
	creepMemory.job = DEFAULT_JOB
}
