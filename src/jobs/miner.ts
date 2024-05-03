

export const doMinerJob = (creep:Creep) => {
    console.log(`Creep ${creep.name} doing miner job`)


    if (!creep.memory.job) return
	if (!creep.memory.job.source) return

	if (!creep.memory.job.status) creep.memory.job.status = "init"

	if (creep.memory.job.status === "init")
		if (creep.store.getFreeCapacity() >= 50) creep.memory.job.status = "mine"
		else creep.memory.job.status = "unload"

	/// MINING
	if (creep.memory.job.status === "mine") {
		// Go get resource
		let source = Game.getObjectById(creep.memory.job.source.id) as Source

		let m = creep.harvest(source)

		if (m === ERR_NOT_IN_RANGE) creep.moveTo(source)

		if (creep.store.getFreeCapacity() === 0) creep.memory.job.status = "unload"
	}

	// UNLOADING
	if (creep.memory.job.status === "unload") {
		if (!creep.memory.job.targets || !creep.memory.job.target)
			if (
				!getNextEnergySink(creep, {
					filter: (s) => {
						if (!s) return false

						let i = Game.getObjectById(s.id) as
							| StructureSpawn
							| StructureExtension
							| StructureStorage
							| StructureTower
							| StructureContainer
						let e = i.store.energy
						let limit = 50

						if (i.structureType === "extension") limit = EXTENSION_ENERGY_CAPACITY[5]
						else if (i.structureType === "spawn") limit = SPAWN_ENERGY_CAPACITY
						else if (i.structureType === "storage") limit = STORAGE_CAPACITY
						else if (i.structureType === "tower") limit = TOWER_CAPACITY
						else if (i.structureType === "container") limit = CONTAINER_CAPACITY

						if (e < limit) return true

						return false
					},
					refresh: true,
				})
			)
				creep.memory.job.status = "overflow"

		if (creep.memory.job.status !== "overflow") {
			if (!creep.memory.job.target) return

			let target = Game.getObjectById(creep.memory.job.target.id) as StructureSpawn

			let c = creep.transfer(target, RESOURCE_ENERGY)
			if (c === ERR_NOT_IN_RANGE) creep.moveTo(target)
			else if (c === ERR_FULL) {
				creep.memory.job.target = creep.memory.job.targets?.shift()
			}

			// Job complete
			if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
				if (creep.memory.role === CreepRole.Miner) creep.memory.job.status = "mine"
				else creep.memory.job.status = "complete"
			}
		}
	}
	if (creep.memory.job.status === "overflow") {
		let target = Game.rooms[creep.room.name].controller as StructureController

		let t = creep.transfer(target, RESOURCE_ENERGY)
		if (t === ERR_NOT_IN_RANGE) creep.moveTo(target)

		// Job complete
		if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
			if (creep.memory.role === CreepRole.Miner) creep.memory.job.status = "mine"
			else creep.memory.job.status = "complete"
		}
	}
}