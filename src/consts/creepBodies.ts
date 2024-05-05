import { CreepRole } from "types/memory"

export const getCreepBody = (availableEnergy: number, role: CreepRole) => {
	console.log(`Getting body composition for ${role} creep. Available energy: ${availableEnergy}`)

	if (role === CreepRole.All)
		switch (availableEnergy) {
			case 300: //Only a spawner
				return [CARRY, CARRY, MOVE, MOVE, WORK]
			case 600:
				return [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK]
			default:
				return [CARRY, CARRY, MOVE, MOVE, WORK]
		}

	return []
}

export const MAX_SPAWNING_ENERGY = {
	0: 300,
	1: 300,
	2: 550,
	3: 800,
	4: 1300,
	5: 1800,
	6: 2300,
	7: 5300,
	8: 12300,
}
