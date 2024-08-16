import { Player } from "../player"
import { Log } from "../log"

export abstract class AbstParser {
    abstract body(): JQuery<HTMLElement>
    abstract villageNo(): string
    abstract today(): number
    abstract isDaytime(): boolean
    abstract eachPlayer(no: number, html: string): Player
    abstract player(): Player[]
    abstract vital(): iVital[]
    abstract vote(): Record<string, iVote>
    abstract death(): Record<string, iDeath>
    abstract discuss(): Log[]
    abstract isUnvote(): boolean
}