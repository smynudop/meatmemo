import { AbstParser } from "./IParser"
import { Player } from "../player"
import { Log } from "../log"

export class WakameteParser extends AbstParser {
    constructor() {
        super()
    }

    body() {
        return $("body")
    }

    villageNo() {
        return $("title").text().slice(0, 6)
    }

    today() {
        var day = /<font size="\+2">(\d{1,2})/.exec($("body").html())
        return day ? +day[1] - 1 : 0
    }

    isDaytime() {
        return $("body").attr("bgcolor") != "#000000";
    }

    vital() {
        let vitals: iVital[] = []
        $("#w_player")
            .find("td:odd")
            .each((i, v) => {
                if (!$(v).html()) return false
                vitals.push(/生存中/.test($(v).html()) ? "alive" : "death")
            })
        return vitals
    }

    death() {
        let deathList: HTMLElement[] = []
        let result: Record<string, iDeath> = {}
        $("#w_discuss")
            .find("td[colspan='2']")
            .each((i, tr) => {
                if (/(で発見|結果処刑|突然死|猫又の呪い)/.test($(tr).text())) {
                    deathList.push(tr)
                }
            })

        let day = this.today()
        let cantco = this.today()
        let isdaytime = this.isDaytime()

        for (let log of deathList) {
            let cn = $(log).find("b").eq(0).text()
            let text = $(log).text()
            let reason = ""
            if (/無残な姿/.test(text)) reason = "bite"
            if (/死体で発見/.test(text)) reason = "note"
            if (/村民協議の結果|猫又の呪い/.test(text)) {
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

        let votelog: HTMLElement[] = []
        $("#w_discuss")
            .find("td[colspan='2']")
            .each(function (i, v) {
                if (/\d{1,2}日目 投票結果。/.test($(v).text())) {
                    votelog.unshift(v)
                }
            })
        if (!votelog.length) return {}

        let daystr = $(votelog[0])
            .text()
            .match(/(\d{1,2})日目 投票結果。/)
        if (!daystr) return {}
        let day = +daystr[1] - 1

        for (let times = 0; times < votelog.length; times++) {
            $(votelog[times])
                .find("tr")
                .each((i, vote) => {
                    let voter = $(vote).find("b").eq(0).text()
                    let target = $(vote).find("b").eq(1).text()
                    if (voter) {
                        if (!result[voter]) {
                            result[voter] = { day: day, targets: [] }
                        }
                        result[voter].targets.push(target)
                    }

                })
        }
        return result
    }

    eachPlayer(no: number, html: string) {
        let name = html.split("<br>")[0]
        let vital: iVital = /生存中/.test(html) ? "alive" : "death"
        return new Player({
            no: no,
            name: name,
            vital: vital,
        })
    }

    player() {
        let players: Player[] = []
        $("#w_player")
            .find("td:odd")
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
        $("#w_discuss")
            .find("tr")
            .each((i, tr) => {
                if ($(tr).children().length == 2) {
                    let name = $(tr).children().eq(0).find("b").eq(0).html()
                    let content = $(tr).children().eq(1).html()
                    let namehtml = $(tr).children().eq(0).html()
                    let colorhtml = namehtml.match(/color="(.+?)"/)
                    let color = colorhtml ? colorhtml[1] : "#000000"

                    let contenthtml = $(tr).children().eq(1).html()
                    let size = contenthtml.includes('size="+1"') ? "big" :
                        contenthtml.includes('size="-1"') ? "small" : "normal"

                    let log = new Log({
                        name: name,
                        color: color,
                        size: size,
                        content: content,
                    })

                    logs.push(log)
                }
            })
        return logs
    }

    isUnvote() {
        return /<font size="\+2">投票/.test($("body").html())
    }

}