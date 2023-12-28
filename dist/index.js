import fs from 'fs';
import { IsGameOver, EvalPosition, GetAllPossiblePositions } from './helper.js';
import * as cliProgress from 'cli-progress';
let you = [1, 1]; // Maximazing player
let other = [1, 1]; // Minimazing player
let players = [you, other];
let positionConcept = {
    maxPlayer: [1, 1], // Maximazing player
    minPlayer: [1, 1] // Minimazing player
};
let currentPlayerIndex = 0;
let globalLogString = "";
function Minimax(position, depth, alpha, beta, maximazingPlayer, maxDepth) {
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
        // globalLogString += "\nEvaluation: " + evaluation.evaluation + " : " + IsGameOver(position) + "\n position (maxplayer): " + evaluation.position.maxPlayer + "\n position (minplayer): " + evaluation.position.minPlayer;
        // console.log(evaluation)
        return evaluation;
    }
    // Logic if not end of the tree:
    if (maximazingPlayer) {
        let maxEval = -3;
        let maxPosition = {
            maxPlayer: [position.maxPlayer[0], position.maxPlayer[1]],
            minPlayer: [position.minPlayer[0], position.minPlayer[1]]
        };
        let allPossiblePositions = GetAllPossiblePositions(position, true);
        for (let i = 0; i < allPossiblePositions.length; i++) {
            let evaluation = Minimax(allPossiblePositions[i], depth - 1, alpha, beta, false, maxDepth).evaluation;
            maxEval = Math.max(maxEval, evaluation);
            if (maxEval == evaluation) {
                maxPosition = allPossiblePositions[i];
            }
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) {
                break;
            }
        }
        if (depth == maxDepth) {
            // globalLogString += `\nBest Move: (maxplayer) ${maxPosition.maxPlayer}, (minplayer) ${maxPosition.minPlayer}`;
            // globalLogString += "\nMove To Play !!!"
        }
        return {
            evaluation: maxEval,
            position: maxPosition
        };
    }
    else {
        let minEval = 3;
        let minPosition = {
            maxPlayer: [position.maxPlayer[0], position.maxPlayer[1]],
            minPlayer: [position.minPlayer[0], position.minPlayer[1]]
        };
        let allPossiblePositions = GetAllPossiblePositions(position, false);
        for (let i = 0; i < allPossiblePositions.length; i++) {
            let evaluation = Minimax(allPossiblePositions[i], depth - 1, alpha, beta, true, maxDepth).evaluation;
            minEval = Math.min(minEval, evaluation);
            if (minEval == evaluation) {
                minPosition = allPossiblePositions[i];
            }
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) {
                break;
            }
            // console.log(allPossiblePositions[i]);
        }
        if (depth == maxDepth) {
            // globalLogString += `\nBest Move: (maxplayer) ${minPosition.maxPlayer}, (minplayer) ${minPosition.minPlayer}`;
            // globalLogString += "\nMove To Play !!!"
        }
        return {
            evaluation: minEval,
            position: minPosition
        };
    }
}
function LogState(consolePrint) {
    let LogString = "";
    if (consolePrint) {
        console.log(currentPlayerIndex);
    }
    if (currentPlayerIndex == 0) {
        LogString += "You";
    }
    else {
        LogString += "Other";
    }
    LogString += "\n you: " + you[0] + " " + you[1];
    LogString += "\n other: " + other[0] + " " + other[1];
    if (consolePrint) {
        console.log(LogString);
    }
    globalLogString += '\n' + LogString;
}
// console.time("minimax");
// console.log(Minimax({
//     maxPlayer: [1, 1],
//     minPlayer: [1, 2]
// }, 10, -3, 3, false, 10));
// console.timeEnd("minimax")
// console.log(`Adding Numbers in default position: maxplayer: ${rearrangeFingers.maxPlayer}, minplayer: ${rearrangeFingers.minPlayer}`)
// Precalc the moves:
// progressbar
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar.start(800, 0);
// let depthString: any =  prompt("At What Depth Do You Want To Calculate?\n   ", "0")
let depth = 15;
// depth = parseInt(depthString);
let positionsToTest = [];
for (let i = 0; i < 5; i++) {
    for (let y = 1; y < 5; y++) {
        for (let o = 0; o < 5; o++) {
            for (let l = 1; l < 5; l++) {
                let posToTest = {
                    maxPlayer: [i, y],
                    minPlayer: [o, l]
                };
                let reversedPosToTest = {
                    maxPlayer: [y, i],
                    minPlayer: [l, o]
                };
                if (posToTest != reversedPosToTest) {
                    positionsToTest.push(posToTest);
                    positionsToTest.push(reversedPosToTest);
                }
                else {
                    positionsToTest.push(posToTest);
                }
            }
        }
    }
}
console.time("withlogging");
for (let i = 0; i < positionsToTest.length; i++) {
    let result = Minimax(positionsToTest[i], depth, -3, 3, true, depth);
    globalLogString += `\n${positionsToTest[i].maxPlayer[0]},${positionsToTest[i].maxPlayer[1]},${positionsToTest[i].minPlayer[0]},${positionsToTest[i].minPlayer[1]}:${result.position.maxPlayer[0]},${result.position.maxPlayer[1]},${result.position.minPlayer[0]},${result.position.minPlayer[1]}`;
    bar.update(i + 1);
}
console.timeEnd("withlogging");
fs.writeFileSync(`./MAXIMAZINGTABLE-${depth}.txt`, globalLogString);
//# sourceMappingURL=index.js.map