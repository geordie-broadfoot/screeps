import { log } from "./log"

export interface HeatMap {
	//pos: RoomPosition
	terrain: number
	value: number
	lastUpdate: number
}

export function createHeatMap(room: Room) {
	const heatMap: HeatMap[] = []

	const terrain = room.getTerrain()

	for (let y = 0; y < 50; y++) {
		for (let x = 0; x < 50; x++) {
			const cell: HeatMap = {
				//pos: new RoomPosition(x, y, room.name),
				terrain: terrain.get(x, y),
				value: 0,
				lastUpdate: Game.time,
			}

			heatMap.push(cell)
		}
	}
	room.memory.heatMap = heatMap
}

export function updateHeatMap(creep: Creep) {
	if (!creep.room.memory.heatMap) {
		createHeatMap(creep.room)
	}

	const cell = creep.room.memory.heatMap[creep.pos.y * 50 + creep.pos.x]

	if (Game.time - cell.lastUpdate > 1000) cell.value = 0

	cell.value++
	cell.lastUpdate = Game.time
}

export function printHeatMapToTerminal(room: Room) {
	room = Game.rooms[room.name]
	if (!room) return
	if (!room.memory.heatMap) return
	const roadPlan: RoomPosition[] = []
	const scale = 1.25
	log.info("Printing heat map for room " + room.name)

	let msg = `<div style='display:flex; flex-direction:column; height:${300 * scale}px; width:${
		300 * scale
	}px;'>`
	for (let y = 0; y < 50; y++) {
		msg += "<div style='display:flex; flex-direction: row;'>"
		for (let x = 0; x < 50; x++) {
			const cell = room.memory.heatMap[y * 50 + x]
			const size = 5
			let a = "1"
			let color = "rgba(28, 28, 28," + a + ")"
			if (cell.terrain === TERRAIN_MASK_SWAMP) color = "rgb(10, 30, 10)"
			else if (cell.terrain === TERRAIN_MASK_WALL) color = "black"

			if (cell.value > 0) {
				if (Game.time - cell.lastUpdate > 500) a = "0.25"
				else if (Game.time - cell.lastUpdate > 250) a = "0.5"
				else if (Game.time - cell.lastUpdate > 100) a = "0.75"
				else if (Game.time - cell.lastUpdate > 50) a = "0.9"
				else if (Game.time - cell.lastUpdate > 10) a = "1"

				if (cell.value < 100) color = "rgba(80, 180, 80," + a + ")"
				else if (cell.value < 80) color = "rgba(70, 150, 70," + a + ")"
				else if (cell.value < 60) color = "rgba(80, 120, 60," + a + ")"
				else if (cell.value < 40) color = "rgba(90, 100, 60," + a + ")"
				else if (cell.value < 20) color = "rgba(100, 80, 40," + a + ")"
				else if (cell.value < 10) color = "rgba(120, 40, 40," + a + ")"
			}

			//delete room.memory.roadPlanner
			if (!room.memory.roadPlanner) room.memory.roadPlanner = []

			if (cell.value > 100) {
				//roadPlan.push(cell.pos)
			}
			msg += `<div style='width:${size * scale}px; height:${
				size * scale
			}px; background-color:${color};' onMouseOver="this.style.backgroundColor='#abe'" onMouseOut="this.style.backgroundColor='${color}'" ></div>`
		}
		msg += "</div>"
	}
	msg += "</div>"
	//log.info("roadplan", roadPlan.length)
	room.memory.roadPlanner = roadPlan
	log.info(msg)
}

export function pruneHeatMap(room: Room) {
	if (!room.memory.heatMap) return
	for (let y = 0; y < 50; y++)
		for (let x = 0; x < 50; x++) {
			const cell = room.memory.heatMap[y * 50 + x]

			if (Game.time - cell.lastUpdate > 500) {
				cell.lastUpdate = Game.time
				cell.value = 0
			}
		}
}
