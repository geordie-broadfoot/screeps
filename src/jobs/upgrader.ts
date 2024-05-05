import { log } from "utils/log"

export const doUpgraderJob = (creep: Creep) => {
	log.info(`Creep ${creep.name} doing upgrader job`)
}

// /*******************************************************************************
//  *                  \ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /
//  *      Upgrade      X  X  X  X  X  X  X  X  X  X  X  X  X  X  X  X  X  X  X
//  *                  / \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \
//  *******************************************************************************/
// function doUpgradingJob(creep: Creep) {
// 	if (!creep.memory.job) return
// 	if (!creep.memory.job.controller) return

// 	let freeCapacity = creep.store.getFreeCapacity()

// 	if (!creep.memory.job.status) creep.memory.job.status = "init"

// 	if (creep.memory.job.status === "init") {
// 		if (creep.store.energy >= 30) creep.memory.job.status = "upgrade"
// 		else creep.memory.job.status = "load"
// 	}

// 	if (creep.memory.job.status === "upgrade") {
// 		let controller = Game.getObjectById(creep.memory.job.controller.id) as StructureController

// 		if (creep.transfer(controller, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) creep.moveTo(controller)

// 		// job complete
// 		if (freeCapacity === creep.store.getCapacity()) {
// 			if (creep.memory.role === CreepRole.Upgrader) creep.memory.job.status = "load"
// 			else creep.memory.job.status = "complete"
// 		}
// 	} else if (creep.memory.job.status === "load") {
// 		if (!creep.memory.job.target)
// 			if (!getNextEnergySource(creep, { filter: (s) => s.store.energy >= 50 })) {
// 				creep.memory.job.status = "complete"
// 				return
// 			}

// 		if (!creep.memory.job.target) return

// 		let target = Game.getObjectById(creep.memory.job.target.id) as Structure

// 		let w = creep.withdraw(target, RESOURCE_ENERGY)

// 		if (w === OK) creep.memory.job.status = "upgrade"
// 		else if (w === ERR_NOT_IN_RANGE) creep.moveTo(target)
// 		else if (w === ERR_NOT_ENOUGH_RESOURCES) creep.memory.job.target = undefined

// 		if (freeCapacity === 0) {
// 			creep.memory.job.status = "upgrade"
// 		}
// 	}
// }
