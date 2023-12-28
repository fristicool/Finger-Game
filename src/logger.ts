export function WinningText(evaluation: number) {

    if (evaluation == -3) return "Losing"
    if (evaluation == 3) return "Winning"
    return ""
}