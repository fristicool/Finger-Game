import fs from 'fs';
import { IsGameOver, EvalPosition, GetAllPossiblePositions, AddNumber, RearrangeFingers } from './helper.js';
import * as cliProgress from 'cli-progress';
import { WinningText } from './logger.js';
import pretty from 'pretty-time';
import colors from "ansi-colors"


// Types:
type position = {
    maxPlayer: number[], // Maximazing player
    minPlayer: number[] // Minimazing player
}

type minmaxout = {
    evaluation: number,
    position: position
}

let globalLogString = "";
let globalDebugString = "";

function Minimax(position: position, depth: number, alpha: number, beta: number, maximazingPlayer: boolean, maxDepth: number) {

    // End Of Tree
    if (depth == 0 || IsGameOver(position)) {
        // Return Eval:

        let evaluation = {
            evaluation: EvalPosition(position),
            position: position
        };
        return evaluation;
    }

    // Logic if not end of the tree:

    if (maximazingPlayer) {
        let maxEval = -3;
        let maxPosition: position = {
            maxPlayer: [position.maxPlayer[0], position.maxPlayer[1]],
            minPlayer: [position.minPlayer[0], position.minPlayer[1]]
        };

        let allPossiblePositions: position[] = GetAllPossiblePositions(position, true);

        for (let i = 0; i < allPossiblePositions.length; i++) {
            let evaluation: number = Minimax(allPossiblePositions[i], depth - 1, alpha, beta, false, maxDepth).evaluation;
            maxEval = Math.max(maxEval, evaluation)
            if (maxEval == evaluation) {
                maxPosition = allPossiblePositions[i];
            }
            alpha = Math.max(alpha, evaluation)
            if (beta <= alpha) {
                break;
            }
        }

        return {
            evaluation: maxEval,
            position: maxPosition

        };

    } else {
        let minEval = 3;
        let minPosition: position = {
            maxPlayer: [position.maxPlayer[0], position.maxPlayer[1]],
            minPlayer: [position.minPlayer[0], position.minPlayer[1]]
        };

        let allPossiblePositions: position[] = GetAllPossiblePositions(position, false);

        for (let i = 0; i < allPossiblePositions.length; i++) {
            let evaluation: number = Minimax(allPossiblePositions[i], depth - 1, alpha, beta, true, maxDepth).evaluation;
            minEval = Math.min(minEval, evaluation)
            if (minEval == evaluation) {
                minPosition = allPossiblePositions[i];
            }
            beta = Math.min(beta, evaluation)
            if (beta <= alpha) {
                break;
            }
        }

        return {
            evaluation: minEval,
            position: minPosition

        };
    }
}

// Precalc the moves:

// Progressbar
const bar = new cliProgress.SingleBar({
    format: colors.greenBright("Training: [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {duration}s"),
    
}, cliProgress.Presets.shades_classic)

let depth: number = 15;
globalDebugString += `Depth: ${depth}`

let positionsToTest: position[] = [];
let arrayOfNames: string[] = []

console.time(colors.blue("Adding All Possibilities"));

for (let i = 0; i < 5; i++) {

    for (let y = 0; y < 5; y++) {

        for (let o = 0; o < 5; o++) {

            for (let l = 0; l < 5; l++) {

                let posToTest: position = {
                    maxPlayer: [i, y],
                    minPlayer: [o, l]
                }

                if ((i + y) != 0 && (o + l) != 0) {
                    let compressedName = `${posToTest.maxPlayer[0]},${posToTest.maxPlayer[1]},${posToTest.minPlayer[0]},${posToTest.minPlayer[1]}`;

                    if (!arrayOfNames.includes(compressedName)) {
                        arrayOfNames.push(compressedName)

                        positionsToTest.push(posToTest);
                    }

                    let reversedPosToTest: position = {
                        maxPlayer: [y, i],
                        minPlayer: [l, o]
                    }

                    compressedName = `${reversedPosToTest.maxPlayer[0]},${reversedPosToTest.maxPlayer[1]},${reversedPosToTest.minPlayer[0]},${reversedPosToTest.minPlayer[1]}`

                    if (!arrayOfNames.includes(compressedName)) {
                        arrayOfNames.push(compressedName)

                        positionsToTest.push(reversedPosToTest);
                    }
                }
            }
        }
    }
}

console.timeEnd(colors.blue("Adding All Possibilities"));
console.log(colors.red(`Depth: ${depth}\n`))

bar.start(positionsToTest.length, 0)

console.time(colors.blue(`\nCalculating Table`));

let tmpDebugString = "";
let tb: number = Date.now();

for (let i = 0; i < positionsToTest.length; i++) {
    let result: minmaxout = Minimax(positionsToTest[i], depth, -3, 3, true, depth)

    globalLogString += `\n${positionsToTest[i].maxPlayer[0]},${positionsToTest[i].maxPlayer[1]},${positionsToTest[i].minPlayer[0]},${positionsToTest[i].minPlayer[1]}:${result.position.maxPlayer[0]},${result.position.maxPlayer[1]},${result.position.minPlayer[0]},${result.position.minPlayer[1]}`
    tmpDebugString += `\n${positionsToTest[i].maxPlayer[0]},${positionsToTest[i].maxPlayer[1]},${positionsToTest[i].minPlayer[0]},${positionsToTest[i].minPlayer[1]}:${result.position.maxPlayer[0]},${result.position.maxPlayer[1]},${result.position.minPlayer[0]},${result.position.minPlayer[1]} : ${result.evaluation} : ${WinningText(result.evaluation)}`
    bar.update(i + 1);
}

let te: number = Date.now();

bar.stop();
console.timeEnd(colors.blue("\nCalculating Table"));

globalDebugString += `\nRraining Time: ${pretty((te - tb)*1000000, 'ms')}\n`

globalDebugString += tmpDebugString;

fs.writeFileSync(`./output/tables/MAXIMAZINGTABLE-${depth}.txt`, globalLogString);
fs.writeFileSync(`./output/debug/debug-${depth}.txt`, globalDebugString);