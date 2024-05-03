import { CreepRole } from "types/memory"
import { setRoomMiningSpots } from "utils/miningSpot"
import { processTowers } from "./tower"
import { Job } from "types/Job"

export function processRoom(room: Room, roomProps: any) {
  // Map all mining jobs in room
  setRoomMiningSpots(room)
  if (!room.memory.jobs)
    room.memory.jobs = {
      mining: undefined,
      building: undefined,
      upgrading: undefined
    } as any
  //   delete room.memory.jobs.upgrading
  //   delete room.memory.jobs.mining

  if (room.memory.jobs.mining === undefined) {
    room.memory.jobs.mining = []
    const deposits = room.find(FIND_SOURCES)
    for (const d in deposits) {
      const dep = deposits[d]
      createMiningJobs(dep)
    }
    room.memory.jobs.totalMiningJobs = room.memory.jobs.mining.length
  }
  if (room.memory.jobs.upgrading === undefined) {
    room.memory.jobs.upgrading = []
    if (room.controller) createUpgradingJobs(room.controller)
  }

  createBuildJobs(room)

  const creeps = room.find(FIND_MY_CREEPS)
  const spawns = room.find(FIND_MY_SPAWNS)
  const extensions =
    (room.memory.extensions as StructureExtension[]) ??
    (room.find(FIND_STRUCTURES, {
      filter: { structureType: "extension" }
    }) as StructureExtension[])
  _.forEach(spawns, spawn => {
    // Spawn New Creeps

    let roomEnergy = spawn.store.energy
    _.forEach(extensions, e => (roomEnergy += e.store.energy))

    console.log(
      `energy: ${roomEnergy}/${
        spawns.length * SPAWN_ENERGY_CAPACITY +
        extensions.length * EXTENSION_ENERGY_CAPACITY[room.controller?.level ?? 0]
      } `
    )

    if (creeps.length < roomProps.creepLimit) {
      const num = Math.floor(Math.random() * 1000)
      const role = CreepRole.All
      if (
        creeps.length > 8 &&
        _.filter(creeps, c => c.memory.role === CreepRole.Upgrader).length <
          roomProps.upgraders
      ) {
        //role = CreepRole.Upgrader
      }

      const s = spawn.spawnCreep(
        [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        "Creep" + num,
        {
          memory: { role: role }
        }
      )
    }
  })

  processTowers(room)
  //   if (Game.time % 150 === 0) pruneHeatMap(room)
  //   if (Game.time % 50 === 0) printHeatMapToTerminal(room)
  //   if (room.memory.roadPlanner)
  //     _.forEach(room.memory.roadPlanner, p => room.visual.circle(p))
}

const createMiningJobs = (source: Source) => {
  let { x, y } = source.pos
  const terrain = source.room.lookForAtArea(LOOK_TERRAIN, y - 1, x - 1, y + 1, x + 1, true)

  const spaces = _.filter(terrain, t => t.terrain === "plain").length

  for (let i = 0; i < spaces; i++) {
    let job: Job = {
      id: global.uuid(),
      status: "init",
      sourceId: source.id,
      destinationId:
      description: "energy",
      roomName: source.room.name,
      type: 'Mining'
    }
    source.room.memory.jobs?.mining?.push(job)
  }
}

const createUpgradingJobs = (controller: StructureController) => {
  const { x, y } = controller.pos

  const terrain = controller.room.lookForAtArea(
    LOOK_TERRAIN,
    y - 1,
    x - 1,
    y + 1,
    x + 1,
    true
  )
  const spaces = _.filter(terrain, t => t.terrain === "plain").length

  for (let i = 0; i < spaces; i++) {
    const job: Job = {
      id: global.uuid(),
      status: "init",
      destinationId: controller.id,
      description: "Upgrading controller",
      roomName: controller.room.name,
      type: "Upgrading",
      sourceId: ''                   ,
    }
    controller.room.memory.jobs?.upgrading?.push(job)
  }
}

function createBuildJobs(room: Room) {
  if (!room.memory.jobs) return
  if (room.memory.jobs.building === undefined) room.memory.jobs.building = []
  if (room.memory.buildOrders === undefined) room.memory.buildOrders = []

  const sites = room.find(FIND_CONSTRUCTION_SITES)
  //console.log("found", sites.length, "build jobs")
  _.forEach(sites, s => {
    if (!room.memory.buildOrders?.includes(s.id)) {
      const job: Job = {
        id: global.uuid(),
        type: "Building",
        status: "init",
        site: s,
        description: "Build " + s.structureType,
        roomName: room.name
      }
      room.memory.buildOrders?.push(s.id)
      room.memory.jobs?.building?.push(job)
    }
  })
}
