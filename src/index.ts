import fs from 'fs'
import { IsGameOver, EvalPosition, GetAllPossiblePositions, AddNumber, RearrangeFingers } from './helper.js'
import * as ps from 'prompt-sync';
import * as cliProgress from 'cli-progress'
import { BADRESP } from 'dns';

// Types:
type position = {
    maxPlayer: number[], // Maximazing player
    minPlayer: number[] // Minimazing player
}

type minmaxout = {
    evaluation: number,
    position: position
}

let globalLogString = ""

function Minimax(position: position, depth: number, alpha: number, beta: number, maximazingPlayer: boolean, maxDepth: number) {
    let stepPosition = {
        maxPlayer: [position.maxPlayer[0], position.maxPlayer[1]],
        minPlayer: [position.minPlayer[0], position.minPlayer[1]]
    };

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
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

bar.start(800, 0)

let depth: number = 15;

let positionsToTest: position[] = [];

for (let i = 0; i < 5; i++) {

    for (let y = 1; y < 5; y++) {

        for (let o = 0; o < 5; o++) {
    
            for (let l = 1; l < 5; l++) {
    
                let posToTest: position = {
                    maxPlayer: [i, y],
                    minPlayer: [o, l]
                }

                let reversedPosToTest: position = {
                    maxPlayer: [y, i],
                    minPlayer: [l, o]
                }

                if (posToTest != reversedPosToTest) {
                    positionsToTest.push(posToTest);
                    positionsToTest.push(reversedPosToTest);
                } else {
                    positionsToTest.push(posToTest);
                }
            }
        }
    }
}

console.time("withlogging");

for (let i = 0; i < positionsToTest.length; i++) {
    let result: minmaxout = Minimax(positionsToTest[i], depth, -3, 3, true, depth)

    globalLogString += `\n${positionsToTest[i].maxPlayer[0]},${positionsToTest[i].maxPlayer[1]},${positionsToTest[i].minPlayer[0]},${positionsToTest[i].minPlayer[1]}:${result.position.maxPlayer[0]},${result.position.maxPlayer[1]},${result.position.minPlayer[0]},${result.position.minPlayer[1]}`
    bar.update(i + 1);
}

bar.stop();
console.timeEnd("withlogging");


fs.writeFileSync(`./MAXIMAZINGTABLE-${depth}.txt`, globalLogString);