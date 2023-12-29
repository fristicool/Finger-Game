export type position = {
    maxPlayer: number[], // Maximazing player
    minPlayer: number[] // Minimazing player
}

export type minmaxout = {
    evaluation: number,
    position: position,
    originalPosition: position
}

export interface WorkerData {
    positions: position[],
    depth: number
}

export interface WorkerOptions {
    workerData: WorkerData
}