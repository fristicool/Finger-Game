type position = {
    maxPlayer: number[], // Maximazing player
    minPlayer: number[] // Minimazing player
}

export function IsGameOver(position: position) {
    if (position.maxPlayer[0] == 0 && position.maxPlayer[1] == 0) {
        return true;
    } else {
        if (position.minPlayer[0] == 0 && position.minPlayer[1] == 0) {
            return true;
        }
    }

    return false;
}

export function AddNumber(position: position, handIndex: number, otherPlayerHandIndex: number, maximazingPlayer: boolean) {
    let returnPosition: position = {
        maxPlayer: [position.maxPlayer[0], position.maxPlayer[1]],
        minPlayer: [position.minPlayer[0], position.minPlayer[1]]
    }

    if (maximazingPlayer) {
        returnPosition.minPlayer[otherPlayerHandIndex] += returnPosition.maxPlayer[handIndex];
        if (returnPosition.minPlayer[otherPlayerHandIndex] > 4) {
            returnPosition.minPlayer[otherPlayerHandIndex] = returnPosition.minPlayer[otherPlayerHandIndex] - 5;
        }
    } else {
        returnPosition.maxPlayer[otherPlayerHandIndex] += returnPosition.minPlayer[handIndex];
        if (returnPosition.maxPlayer[otherPlayerHandIndex] > 4) {
            returnPosition.maxPlayer[otherPlayerHandIndex] = returnPosition.maxPlayer[otherPlayerHandIndex] - 5;
        }
    }

    return returnPosition;
}

export function RearrangeFingers(position: position, firstHand: number, secondHand: number, maximazingPlayer: boolean) {

    let returnPosition: position = {
        maxPlayer: [position.maxPlayer[0], position.maxPlayer[1]],
        minPlayer: [position.minPlayer[0], position.minPlayer[1]]
    }

    if (maximazingPlayer) {
        returnPosition.maxPlayer[0] = firstHand
        if (returnPosition.maxPlayer[0] > 4) {
            returnPosition.maxPlayer[0] -= 5;
        }

        returnPosition.maxPlayer[1] = secondHand
        if (returnPosition.maxPlayer[1] > 4) {
            returnPosition.maxPlayer[1] -= 5;
        }
    } else {
        returnPosition.minPlayer[0] = firstHand
        if (returnPosition.minPlayer[0] > 4) {
            returnPosition.minPlayer[0] -= 5;
        }

        returnPosition.minPlayer[1] = secondHand
        if (returnPosition.minPlayer[1] > 4) {
            returnPosition.minPlayer[1] -= 5;
        }
    }

    return returnPosition;
}

export function OtherPlayerIndex(playerIndex: number) {
    if (playerIndex == 0) return 1
    return 0
}

export function EvalPosition(position: position) {
    // 00 = game over
    // 1 = min 0 1
    // -1 = mas 0 1

    if (position.maxPlayer[0] == 0 && position.maxPlayer[1] == 0) {
        return -3; // Min Player Won
    }
    if (position.minPlayer[0] == 0 && position.minPlayer[1] == 0) {
        return 3; // Max Player Won
    }

    let finalEval: number = 0;

    if (position.maxPlayer[0] == 0 && position.maxPlayer[1] != 0 || position.maxPlayer[0] != 0  && position.maxPlayer[1] == 0 ) {
        finalEval -= 1;
    }

    if (position.minPlayer[0] == 0 && position.minPlayer[1] != 0 || position.minPlayer[0] != 0  && position.minPlayer[1] == 0 ) {
        finalEval += 1;
    }

    return finalEval;
}

export function GetAllPossiblePositions(position: position, maximazingPlayer: boolean) {

    let positions: position[] = [];

    // Adding Fingers:

    positions.push(AddNumber(position, 0, 0, maximazingPlayer));
    positions.push(AddNumber(position, 0, 1, maximazingPlayer));
    positions.push(AddNumber(position, 1, 0, maximazingPlayer));
    positions.push(AddNumber(position, 1, 1, maximazingPlayer));

    // Rearranging Fingers:

    // Get Total Finger Count over 2 Hands:
    let totalCount: number = 0;

    if (maximazingPlayer) {
        totalCount = position.maxPlayer[0] + position.maxPlayer[1];

        if (position.maxPlayer[0] == 1 && position.maxPlayer[1] == 1) return positions;
    }
    if (!maximazingPlayer) {
        totalCount = position.minPlayer[0] + position.minPlayer[1];

        if (position.minPlayer[0] == 1 && position.minPlayer[1] == 1) return positions;
    }

    for (let i = 0; i < totalCount; i++) {

        if (totalCount - 1 < i) {
            break;
        }

        let rearrangedFingers: position = RearrangeFingers(position, totalCount - i, i, maximazingPlayer)

        if (maximazingPlayer) {
            if (rearrangedFingers.maxPlayer[0] == position.maxPlayer[0] || rearrangedFingers.maxPlayer[1] == position.maxPlayer[1]) {
                let tmpCount = rearrangedFingers.maxPlayer[0];

                rearrangedFingers.maxPlayer[0] = rearrangedFingers.maxPlayer[1];
                rearrangedFingers.maxPlayer[1] = tmpCount; 
            }
        } else {
            if (rearrangedFingers.minPlayer[0] == position.minPlayer[0] || rearrangedFingers.minPlayer[1] == position.minPlayer[1]) {
                let tmpCount = rearrangedFingers.minPlayer[0];

                rearrangedFingers.minPlayer[0] = rearrangedFingers.minPlayer[1];
                rearrangedFingers.minPlayer[1] = tmpCount; 
            }
        }

        positions.push(rearrangedFingers)

    }


    return positions;
}