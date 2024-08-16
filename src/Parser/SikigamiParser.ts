import { AbstParser } from "./IParser"
import { Player } from "../player"
import { Log } from "../log"
export class SikigamiParser extends AbstParser {
    constructor() {
        super()
    }

    body() {
        return $("body")
    }

    villageNo() {
        return location.href.match(/room_no=(\d+)/)![1]
    }

    today() {
        var timetable = $("table.time-table")
        if (timetable.length == 0) {
            return 0
        }
        var day = timetable.eq(0).html().match(/(\d+) 日目/)
        return day ? +day[1] - 1 : 0
    }

    isDaytime() {
        return !/game_night\.css/.test($("head").html())
    }

    vital() {
        let vitals: iVital[] = []

        this.body()
            .find("div.player table td:odd")
            .each((i, v) => {
                if (!$(v).html()) return false
                vitals.push(/生存中/.test($(v).html()) ? "alive" : "death")
            })
        return vitals
    }

    death() {
        let deathList: HTMLElement[] = []
        let result: Record<string, iDeath> = {}
        $("table.dead-type td")
            .each((i, tr) => {
                if (/(で発見|結果処刑|突然死|猫又の呪い)/.test($(tr).text())) {
                    deathList.push(tr)
                }
            })

        let day = this.today()
        let cantco = this.today()
        let isdaytime = this.isDaytime()

        for (let log of deathList) {
            let cn = $(log).text().split(" は")[0]
            let text = $(log).text()
            let reason = ""
            if (/無残な姿/.test(text)) reason = "bite"
            if (/死体で発見/.test(text)) reason = "note"
            if (/投票の結果|猫又の呪い/.test(text)) {
                reason = "exec"
                isdaytime ? day-- : cantco++
            }
            if (/突然死/.test(text)) {
                reason = "sudden"
                cantco++
            }
            result[cn] = {
                reason: reason,
                cantco: cantco,
                day: day,
            }
        }
        return result
    }

    vote() {
        let result: Record<string, iVote> = {}

        let tables = $("table.vote-list")
        if (!tables.length) return result

        tables.each((i, table) => {
            let day = $(table).find("td").eq(0).text().match(/(\d+) 日目/)![1]
            $(table)
                .find("tr")
                .each((i, vote) => {
                    let voter = $(vote).find(".vote-name").eq(0).text()
                    let target = $(vote).find(".vote-name").eq(1).text()
                    if (voter) {
                        if (!result[voter]) {
                            result[voter] = { day: +day, targets: [] }
                        }
                        result[voter].targets.push(target)
                    }

                })
        })


        return result
    }

    eachPlayer(no: number, html: string) {
        let name = html.split("<br>")[0].split(">").pop()
        let vital: iVital = /生存中/.test(html) ? "alive" : "death"
        return new Player({
            no: no,
            name: name,
            vital: vital,
        })
    }

    player() {
        let players: Player[] = []

        this.body()
            .find("div.player table td:odd")
            .each((i, v) => {
                let html = $(v).html()
                if (!html) return false

                let player = this.eachPlayer(i, html)
                players.push(player)

            })
        return players
    }

    discuss() {
        let logs: Log[] = []

        if (!this.isDaytime) return []

        this.body()
            .find("tr.user-talk")
            .each((i, tr) => {
                let name = $(tr).find("td.user-name").text().slice(1)
                let content = $(tr).children().eq(1).html()
                let namehtml = $(tr).find("td.user-name").html()
                let color = namehtml.match(/color="(.+?)"/)![1]

                let log = new Log({
                    name: name,
                    color: color,
                    content: content,
                    size: "normal"
                })

                logs.push(log)
            })
        return logs
    }

    isUnvote() {
        return this.isDaytime() && $(".system-vote").length > 0
    }

}