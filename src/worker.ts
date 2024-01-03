import { workerData, parentPort } from "worker_threads"
import { Minimax } from "./helper.js";
import { WinningText } from "./logger.js";

let positionsToTest = workerData.positions;
let depth = workerData.depth;

let LogString = ""
let DebugString = ""

for (let i = 0; i < positionsToTest.length; i++) {
    let result = Minimax(positionsToTest[i], depth, -3, 3, true, depth)
    LogString += `\n${positionsToTest[i].maxPlayer[0]},${positionsToTest[i].maxPlayer[1]},${positionsToTest[i].minPlayer[0]},${positionsToTest[i].minPlayer[1]}:${result.position.maxPlayer[0]},${result.position.maxPlayer[1]},${result.position.minPlayer[0]},${result.position.minPlayer[1]}`
    DebugString += `\n${positionsToTest[i].maxPlayer[0]},${positionsToTest[i].maxPlayer[1]},${positionsToTest[i].minPlayer[0]},${positionsToTest[i].minPlayer[1]}:${result.position.maxPlayer[0]},${result.position.maxPlayer[1]},${result.position.minPlayer[0]},${result.position.minPlayer[1]} : ${result.evaluation} : ${WinningText(result.evaluation)}`

    parentPort?.postMessage("onedone")
}
parentPort?.postMessage({
    logString: LogString,
    debugString: DebugString
})