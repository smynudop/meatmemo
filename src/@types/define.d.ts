type iVital = "death" | "alive"

interface iVote {
    day: number
    targets: string[]
}

interface iDeath {
    reason: string | null
    day: number | null
    cantco: number
}