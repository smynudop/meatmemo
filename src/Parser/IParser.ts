import { Player } from "../player"
import { Log } from "../log"

export interface IParser {
    name: string
    body(): JQuery<HTMLElement>
    villageNo(): string
    today(): number
    isDaytime(): boolean
    eachPlayer(no: number, html: string): Player
    player(): Player[]
    vital(): iVital[]
    vote(): Record<string, iVote>
    death(): Record<string, iDeath>
    discuss(): Log[]
    isUnvote(): boolean
}