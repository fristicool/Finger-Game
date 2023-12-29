import { workerData, parentPort } from "worker_threads";
import { Minimax } from "./helper.js";
import { WinningText } from "./logger.js";
import cliProgress from "cli-progress";
import colors from "ansi-colors";
let positionsToTest = workerData.positions;
let depth = workerData.depth;
let LogString = "";
let DebugString = "";
const bar = new cliProgress.SingleBar({
    format: colors.greenBright("Training: [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {duration}s"),
}, cliProgress.Presets.shades_classic);
bar.start(positionsToTest.length, 0);
for (let i = 0; i < positionsToTest.length; i++) {
    let result = Minimax(positionsToTest[i], depth, -3, 3, true, depth);
    LogString += `\n${positionsToTest[i].maxPlayer[0]},${positionsToTest[i].maxPlayer[1]},${positionsToTest[i].minPlayer[0]},${positionsToTest[i].minPlayer[1]}:${result.position.maxPlayer[0]},${result.position.maxPlayer[1]},${result.position.minPlayer[0]},${result.position.minPlayer[1]}`;
    DebugString += `\n${positionsToTest[i].maxPlayer[0]},${positionsToTest[i].maxPlayer[1]},${positionsToTest[i].minPlayer[0]},${positionsToTest[i].minPlayer[1]}:${result.position.maxPlayer[0]},${result.position.maxPlayer[1]},${result.position.minPlayer[0]},${result.position.minPlayer[1]} : ${result.evaluation} : ${WinningText(result.evaluation)}`;
    bar.increment(1);
}
bar.stop();
parentPort === null || parentPort === void 0 ? void 0 : parentPort.postMessage({
    logString: LogString,
    debugString: DebugString
});
//# sourceMappingURL=worker.js.map