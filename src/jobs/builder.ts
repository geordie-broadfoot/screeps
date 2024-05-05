import { log } from "utils/log"

export const doBuildingJob = (creep: Creep) => {
	log.info(`${creep.name} doing building job`)
}

// /*******************************************************************************
//  *                  \ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /
//  *      BUILD        X  X  X  X  X  X  X  X  X  X  X  X  X  X  X  X  X  X  X
//  *                  / \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \
//  *******************************************************************************/
// function doBuildingJob(creep: Creep) {
// 	if (!creep.memory.job) return
// 	if (!creep.memory.job.site) return

// 	if (!creep.memory.job.status) creep.memory.job.status = "init"

// 	if (creep.memory.job.status === "init") {
// 		if (creep.store.energy >= 50) creep.memory.job.status = "build"
// 		else creep.memory.job.status = "load"
// 	}

// 	if (creep.memory.job.status === "load") {
// 		// Find a target to get energy from
// 		if (!creep.memory.job.target || !creep.memory.job.targets)
// 			if (
// 				!getNextEnergySource(creep, {
// 					filter: (s) => s.store.energy >= 50,
// 					refresh: true,
// 				})
// 			) {
// 				return
// 			}

// 		if (!creep.memory.job.target) return

// 		let target = Game.getObjectById(creep.memory.job.target.id) as Structure

// 		let w = creep.withdraw(target, RESOURCE_ENERGY)

// 		if (w === OK) creep.memory.job.status = "build"
// 		else if (w === ERR_NOT_IN_RANGE) creep.moveTo(target)
// 		else if (w === ERR_NOT_ENOUGH_RESOURCES) creep.memory.job.target = undefined
// 	}
// 	// end load

// 	// Build
// 	if (creep.memory.job.status === "build") {
// 		if (!creep.memory.job.site) return
// 		let target = Game.getObjectById(creep.memory.job.site.id) as ConstructionSite

// 		if (!target) creep.memory.job.status = "complete"

// 		let b = creep.build(target)

// 		if (target && target.progress === target.progressTotal) creep.memory.job.status = "complete"
// 		else if (creep.store.energy === 0) {
// 			if (creep.memory.role === CreepRole.Builder) creep.memory.job.status = "load"
// 			else releaseJob(creep.memory)
// 		} else if (b === ERR_NOT_IN_RANGE)
// 			creep.moveTo(target, {
// 				visualizePathStyle: {
// 					fill: "transparent",
// 					stroke: "#fff",
// 					lineStyle: "dashed",
// 					strokeWidth: 0.15,
// 					opacity: 0.1,
// 				},
// 			})
// 		else if (b === ERR_NOT_ENOUGH_RESOURCES) creep.memory.job.status = "load"
// 	}
// }
