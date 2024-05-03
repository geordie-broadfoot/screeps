import { Job } from "types/Job"
import { HeatMap } from "utils/heatMap"

export interface _CreepMemory {
  role: CreepRole
  job: Job
  room?: string
}

export interface _RoomMemory {
  [index: string]: any
  heatMap?: HeatMap[]
  jobs?: JobList
  buildOrders?: string[]
  roadPlanner?: RoomPosition[]
  sources?: MiningSpot[]
}

export enum CreepRole {
  All,
  Miner,
  Hauler,
  Fighter,
  Upgrader,
  Builder
}

export interface JobList {
  [index: string]: any
  mining: {[index:string]:Job}
  upgrading: {[index:string]:Job}
  building: {[index:string]:Job}
}

export interface MiningSpot {
  sourceId: string
  pos: RoomPosition
  spots: RoomPosition[]
  hasDedicatedMiner: boolean
  hasContainer: boolean
  containerId: string
}
