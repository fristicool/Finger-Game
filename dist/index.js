import fs from 'fs';
import pretty from 'pretty-time';
import colors from "ansi-colors";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { Worker } from 'worker_threads';
import { chuckify } from './helper.js';
import os from 'os';
const cpuCount = os.cpus().length;
let globalLogString = "";
let globalDebugString = "";
// Precalc the moves:
// Progressbar
// const bar = new cliProgress.SingleBar({
//     format: colors.greenBright("Training: [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {duration}s"),
// }, cliProgress.Presets.shades_classic)
let depth = 15;
globalDebugString += `Depth: ${depth}`;
let positionsToTest = [];
let arrayOfNames = [];
console.time(colors.blue("Adding All Possibilities"));
for (let i = 0; i < 5; i++) {
    for (let y = 0; y < 5; y++) {
        for (let o = 0; o < 5; o++) {
            for (let l = 0; l < 5; l++) {
                let posToTest = {
                    maxPlayer: [i, y],
                    minPlayer: [o, l]
                };
                if ((i + y) != 0 && (o + l) != 0) {
                    let compressedName = `${posToTest.maxPlayer[0]},${posToTest.maxPlayer[1]},${posToTest.minPlayer[0]},${posToTest.minPlayer[1]}`;
                    if (!arrayOfNames.includes(compressedName)) {
                        arrayOfNames.push(compressedName);
                        positionsToTest.push(posToTest);
                    }
                    let reversedPosToTest = {
                        maxPlayer: [y, i],
                        minPlayer: [l, o]
                    };
                    compressedName = `${reversedPosToTest.maxPlayer[0]},${reversedPosToTest.maxPlayer[1]},${reversedPosToTest.minPlayer[0]},${reversedPosToTest.minPlayer[1]}`;
                    if (!arrayOfNames.includes(compressedName)) {
                        arrayOfNames.push(compressedName);
                        positionsToTest.push(reversedPosToTest);
                    }
                }
            }
        }
    }
}
console.timeEnd(colors.blue("Adding All Possibilities"));
console.log(colors.red(`Depth: ${depth}\n`));
// bar.start(positionsToTest.length, 0)
console.time(colors.blue(`\nCalculating Table`));
let tmpDebugString = "";
// let tb: number = Date.now();
let promisses = [];
let chuncks = chuckify(positionsToTest, cpuCount);
for (let i = 0; i < chuncks.length; i++) {
    promisses.push(MinimaxAsync(chuncks[i], depth));
}
let tb = Date.now();
await Promise.all(promisses);
// bar.stop();
console.timeEnd(colors.blue("\nCalculating Table"));
let te = Date.now();
globalDebugString += `\nTraining Time: ${pretty((te - tb) * 1000000, 'ms')}\n`;
globalDebugString += tmpDebugString;
fs.writeFileSync(`./output/tables/MAXIMAZINGTABLE-${depth}.txt`, globalLogString);
fs.writeFileSync(`./output/debug/debug-${depth}.txt`, globalDebugString);
async function MinimaxAsync(positionsToTest, depth) {
    return new Promise((resolve) => {
        let workerData = {
            positions: positionsToTest,
            depth: depth
        };
        const worker = new Worker(__dirname + '/worker.js', {
            // @ts-ignore
            workerData: workerData
        });
        worker.on('message', (result) => {
            tmpDebugString += result.debugString;
            globalLogString += result.logString;
            // bar.increment(positionsToTest.length);
            resolve();
        });
    });
}
//# sourceMappingURL=index.js.map