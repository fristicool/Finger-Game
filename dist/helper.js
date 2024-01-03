export function IsGameOver(position) {
    if (position.maxPlayer[0] == 0 && position.maxPlayer[1] == 0) {
        return true;
    }
    else {
        if (position.minPlayer[0] == 0 && position.minPlayer[1] == 0) {
            return true;
        }
    }
    return false;
}
export function AddNumber(position, handIndex, otherPlayerHandIndex, maximazingPlayer) {
    let returnPosition = {
        maxPlayer: [position.maxPlayer[0], position.maxPlayer[1]],
        minPlayer: [position.minPlayer[0], position.minPlayer[1]]
    };
    if (maximazingPlayer) {
        returnPosition.minPlayer[otherPlayerHandIndex] += returnPosition.maxPlayer[handIndex];
        if (returnPosition.minPlayer[otherPlayerHandIndex] > 4) {
            returnPosition.minPlayer[otherPlayerHandIndex] = returnPosition.minPlayer[otherPlayerHandIndex] - 5;
        }
    }
    else {
        returnPosition.maxPlayer[otherPlayerHandIndex] += returnPosition.minPlayer[handIndex];
        if (returnPosition.maxPlayer[otherPlayerHandIndex] > 4) {
            returnPosition.maxPlayer[otherPlayerHandIndex] = returnPosition.maxPlayer[otherPlayerHandIndex] - 5;
        }
    }
    return returnPosition;
}
export function RearrangeFingers(position, firstHand, secondHand, maximazingPlayer) {
    let returnPosition = {
        maxPlayer: [position.maxPlayer[0], position.maxPlayer[1]],
        minPlayer: [position.minPlayer[0], position.minPlayer[1]]
    };
    if (maximazingPlayer) {
        returnPosition.maxPlayer[0] = firstHand;
        if (returnPosition.maxPlayer[0] > 4) {
            returnPosition.maxPlayer[0] -= 5;
        }
        returnPosition.maxPlayer[1] = secondHand;
        if (returnPosition.maxPlayer[1] > 4) {
            returnPosition.maxPlayer[1] -= 5;
        }
    }
    else {
        returnPosition.minPlayer[0] = firstHand;
        if (returnPosition.minPlayer[0] > 4) {
            returnPosition.minPlayer[0] -= 5;
        }
        returnPosition.minPlayer[1] = secondHand;
        if (returnPosition.minPlayer[1] > 4) {
            returnPosition.minPlayer[1] -= 5;
        }
    }
    return returnPosition;
}
export function OtherPlayerIndex(playerIndex) {
    if (playerIndex == 0)
        return 1;
    return 0;
}
export function EvalPosition(position) {
    // 00 = game over
    // 1 = min 0 1
    // -1 = mas 0 1
    if (position.maxPlayer[0] == 0 && position.maxPlayer[1] == 0) {
        return -3; // Min Player Won
    }
    if (position.minPlayer[0] == 0 && position.minPlayer[1] == 0) {
        return 3; // Max Player Won
    }
    let finalEval = 0;
    if (position.maxPlayer[0] == 0 && position.maxPlayer[1] != 0 || position.maxPlayer[0] != 0 && position.maxPlayer[1] == 0) {
        finalEval -= 1;
    }
    if (position.minPlayer[0] == 0 && position.minPlayer[1] != 0 || position.minPlayer[0] != 0 && position.minPlayer[1] == 0) {
        finalEval += 1;
    }
    return finalEval;
}
export function GetAllPossiblePositions(position, maximazingPlayer) {
    let positions = [];
    // Adding Fingers:
    positions.push(AddNumber(position, 0, 0, maximazingPlayer));
    positions.push(AddNumber(position, 0, 1, maximazingPlayer));
    positions.push(AddNumber(position, 1, 0, maximazingPlayer));
    positions.push(AddNumber(position, 1, 1, maximazingPlayer));
    // Rearranging Fingers:
    // Get Total Finger Count over 2 Hands:
    let totalCount = 0;
    if (maximazingPlayer) {
        totalCount = position.maxPlayer[0] + position.maxPlayer[1];
        if (position.maxPlayer[0] == 1 && position.maxPlayer[1] == 1)
            return positions;
    }
    if (!maximazingPlayer) {
        totalCount = position.minPlayer[0] + position.minPlayer[1];
        if (position.minPlayer[0] == 1 && position.minPlayer[1] == 1)
            return positions;
    }
    for (let i = 0; i < totalCount; i++) {
        if (totalCount - 1 < i) {
            break;
        }
        let rearrangedFingers = RearrangeFingers(position, totalCount - i, i, maximazingPlayer);
        positions.push(rearrangedFingers);
        if (maximazingPlayer) {
            if (rearrangedFingers.maxPlayer[0] == position.maxPlayer[0] && rearrangedFingers.maxPlayer[1] == position.maxPlayer[1]) {
                positions.pop();
            }
            if (rearrangedFingers.maxPlayer[1] == position.maxPlayer[0] && rearrangedFingers.maxPlayer[0] == position.maxPlayer[1]) {
                positions.pop();
            }
        }
        else {
            if (rearrangedFingers.minPlayer[0] == position.minPlayer[0] && rearrangedFingers.minPlayer[1] == position.minPlayer[1]) {
                positions.pop();
            }
            if (rearrangedFingers.minPlayer[1] == position.minPlayer[0] && rearrangedFingers.minPlayer[0] == position.minPlayer[1]) {
                positions.pop();
            }
        }
    }
    return positions;
}
export function Minimax(position, depth, alpha, beta, maximazingPlayer, maxDepth) {
    let stepPosition = {
        maxPlayer: [position.maxPlayer[0], position.maxPlayer[1]],
        minPlayer: [position.minPlayer[0], position.minPlayer[1]]
    };
    // End Of Tree
    if (depth == 0 || IsGameOver(position)) {
        // Return Eval:
        let evaluation = {
            evaluation: EvalPosition(position),
            position: position,
            originalPosition: stepPosition
        };
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
        return {
            evaluation: maxEval,
            position: maxPosition,
            originalPosition: stepPosition
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
        }
        return {
            evaluation: minEval,
            position: minPosition,
            originalPosition: stepPosition
        };
    }
}
export function chuckify(positions, n) {
    let chuncks = [];
    for (let i = n; i > 0; i--) {
        chuncks.push(positions.splice(0, Math.ceil(positions.length / i)));
    }
    return chuncks;
}
//# sourceMappingURL=helper.js.map