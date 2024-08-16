import type { IFortuneResult, IJob, IReasoning, IJobResult } from "./constants"
import { JOB_INITIAL } from "./constants"

export interface IPlayer {
    no: number
    name: string
    vital: iVital
    job: IJob
    reasoning: IReasoning
    jobresult: IJobResult[]
    vote: string[][]
    death: iDeath
}

export class Player implements IPlayer {
    no: number
    name: string
    vital: iVital
    job: IJob
    reasoning: IReasoning
    jobresult: IJobResult[]
    vote: string[][]
    death: iDeath
    constructor(data: Partial<IPlayer>) {
        this.no = data.no || 0
        this.name = data.name || ""
        this.vital = data.vital || "alive"
        this.job = data.job || "gray"
        this.reasoning = data.reasoning || "gray"
        this.jobresult = data.jobresult || []
        this.vote = data.vote || []
        this.death = data.death || { reason: null, day: null, cantco: 99 }
    }

    forSave() {
        return {
            name: this.name,
            no: this.no,
            vital: this.vital,
            job: this.job,
            reasoning: this.reasoning,
            jobresult: this.jobresult,
            vote: this.vote,
            death: this.death,
        }
    }

    updateVital(vital: iVital) {
        this.vital = vital
    }

    setJudge(day: number, judge: IFortuneResult) {
        this.jobresult.fillundef({ target: 99, judge: "notinput" }, +day)
        this.jobresult[day].judge = judge
    }

    setTarget(day: number, target: number) {
        this.jobresult.fillundef({ target: 99, judge: "notinput" }, +day)
        this.jobresult[day].target = target
    }

    canCO(day: number) {
        switch (this.job) {
            case "fortune":
                return day < this.death.cantco
            case "necro":
                return day < this.death.cantco && day > 1
            default:
                return false
        }
    }

    jobInitial(): string {
        return JOB_INITIAL[this.reasoning] + JOB_INITIAL[this.job]
    }
}