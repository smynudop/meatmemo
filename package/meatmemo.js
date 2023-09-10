"use strict";
Array.prototype.fillundef = function (def, lastindex) {
    lastindex = lastindex + 1 || this.length;
    for (let i = 0; i < lastindex; i++) {
        if (this[i] === null || this[i] === undefined) {
            this[i] = JSON.parse(JSON.stringify(def));
        }
    }
};
function createSelectBox(option, selected, attr) {
    let select = $("<select></select>");
    for (let k in attr) {
        select.attr(k, attr[k]);
    }
    for (let i in option) {
        let opt = $("<option></option>");
        opt.attr("value", i);
        opt.text(option[i]);
        if (i == selected) {
            opt.attr("selected", "selected");
        }
        opt.appendTo(select);
    }
    return select;
}
const COLORLIST = {
    0: "選択▼",
    1: "明灰",
    2: "暗灰",
    3: "黄色",
    4: "オレンジ",
    5: "赤",
    6: "水色",
    7: "青",
    8: "黄緑",
    9: "紫",
    10: "桃色",
    11: "肌色",
    12: "茶色",
    13: "緑",
    14: "若草色",
    15: "真紅",
    16: "薄茶色",
    17: "藍色",
    18: "蒼",
    19: "ピンク",
    20: "銀色",
    21: "薄紫",
    22: "象牙色",
    23: "黒",
};
const joblist = {
    gray: "",
    fortune: "占い",
    necro: "霊能",
    share: "共有",
    guard: "狩人",
    cat: "猫又",
    beast: "人外",
};
const reasoninglist = {
    gray: "",
    real: "真",
    fake: "偽",
    villager: "村人",
    madman: "狂人",
    wolf: "人狼",
    fox: "妖狐",
};
const resultlist = { notinput: "", white: "○", black: "●" };
const jobinitial = {
    fortune: "占",
    necro: "霊",
    share: "共",
    cat: "猫",
    guard: "狩",
    wolf: "狼",
    madman: "狂",
    fox: "狐",
    villager: "村",
    real: "真",
    fake: "偽",
    beast: "外",
    gray: "",
};
const themeList = {
    crimson: { main: "crimson", sub: "#EC365A" },
    darkorange: { main: "darkorange", sub: "#FF9F32" },
    darkgreen: { main: "darkgreen", sub: "#009300" },
    navy: { main: "navy", sub: "#0000b2" },
    purple: { main: "purple", sub: "#B200B2" },
    sienna: { main: "sienna", sub: "#C66538" },
};
const reasonflavor = { bite: "無残", note: "デスノ", exec: "処刑", sudden: "突然死" };
const settingDefault = {
    rewrite_css: {
        value: "yes",
        option: { yes: "はい", no: "いいえ" },
        name: "見た目を変更する",
    },
    auto_import_log: {
        value: "onetime",
        option: { none: "しない", onetime: "投票時", alltime: "常時" },
        name: "自動ログ取得のタイミング",
    },
    alert_vote: {
        value: "yes",
        name: "未投票時に警告する",
        option: { yes: "はい", no: "いいえ" },
    },
    send_support: {
        value: "ctrl",
        name: "支援キー+ENTERで送信",
        option: { none: "しない", ctrl: "CTRL", shift: "SHIFT" },
    },
    autoreload_interval: {
        value: "30",
        name: "自動更新(観戦時のみ)",
        option: { 10: "10秒", 20: "20秒", 30: "30秒", 60: "60秒" },
    },
    theme_color: {
        value: "navy",
        name: "テーマカラー",
        option: {
            crimson: "紅",
            darkorange: "オレンジ",
            darkgreen: "緑",
            navy: "蒼",
            purple: "紫",
            sienna: "茶",
        },
    },
    layout: {
        value: "no",
        name: "表を横に並べる(横幅と相談)",
        option: { yes: "はい", no: "いいえ" },
    },
    grayregion: {
        value: "no",
        name: "人外と推理した占い師の結果は<br>完グレ判定に使用しない",
        option: { yes: "はい", no: "いいえ" },
    },
    coloringName: {
        value: "no",
        name: "役職で色分けする(試験運用)",
        option: { yes: "はい", no: "いいえ" },
    },
};
const nameColor = {
    black: "なし",
    red: "赤",
    pink: "ピンク",
    blue: "青",
    green: "緑",
    purple: "紫",
    brown: "茶",
    gaming: "虹色",
};
const colorSettingDefault = {
    gray: {
        value: "black",
        name: "グレー",
        option: nameColor,
    },
    fortune: {
        value: "black",
        name: "占い",
        option: nameColor,
    },
    necro: {
        value: "black",
        name: "霊能",
        option: nameColor,
    },
    share: {
        value: "black",
        name: "共有",
        option: nameColor,
    },
    guard: {
        value: "black",
        name: "狩人",
        option: nameColor,
    },
    cat: {
        value: "black",
        name: "猫又",
        option: nameColor,
    },
    beast: {
        value: "black",
        name: "人外",
        option: nameColor,
    },
};
class AbstParser {
}
class WakameteParser extends AbstParser {
    constructor() {
        super();
    }
    body() {
        return $("body");
    }
    villageNo() {
        return $("title").text().slice(0, 6);
    }
    today() {
        var day = /<font size="\+2">(\d{1,2})/.exec($("body").html());
        return day ? +day[1] - 1 : 0;
    }
    isDaytime() {
        return $("body").attr("bgcolor") != "#000000";
    }
    vital() {
        let vitals = [];
        $("#w_player")
            .find("td:odd")
            .each((i, v) => {
            if (!$(v).html())
                return false;
            vitals.push(/生存中/.test($(v).html()) ? "alive" : "death");
        });
        return vitals;
    }
    death() {
        let deathList = [];
        let result = {};
        $("#w_discuss")
            .find("td[colspan='2']")
            .each((i, tr) => {
            if (/(で発見|結果処刑|突然死|猫又の呪い)/.test($(tr).text())) {
                deathList.push(tr);
            }
        });
        let day = this.today();
        let cantco = this.today();
        let isdaytime = this.isDaytime();
        for (let log of deathList) {
            let cn = $(log).find("b").eq(0).text();
            let text = $(log).text();
            let reason = "";
            if (/無残な姿/.test(text))
                reason = "bite";
            if (/死体で発見/.test(text))
                reason = "note";
            if (/村民協議の結果|猫又の呪い/.test(text)) {
                reason = "exec";
                isdaytime ? day-- : cantco++;
            }
            if (/突然死/.test(text)) {
                reason = "sudden";
                cantco++;
            }
            result[cn] = {
                reason: reason,
                cantco: cantco,
                day: day,
            };
        }
        return result;
    }
    vote() {
        let result = {};
        let votelog = [];
        $("#w_discuss")
            .find("td[colspan='2']")
            .each(function (i, v) {
            if (/\d{1,2}日目 投票結果。/.test($(v).text())) {
                votelog.unshift(v);
            }
        });
        if (!votelog.length)
            return {};
        let daystr = $(votelog[0])
            .text()
            .match(/(\d{1,2})日目 投票結果。/);
        if (!daystr)
            return {};
        let day = +daystr[1] - 1;
        for (let times = 0; times < votelog.length; times++) {
            $(votelog[times])
                .find("tr")
                .each((i, vote) => {
                let voter = $(vote).find("b").eq(0).text();
                let target = $(vote).find("b").eq(1).text();
                if (voter) {
                    if (!result[voter]) {
                        result[voter] = { day: day, targets: [] };
                    }
                    result[voter].targets.push(target);
                }
            });
        }
        return result;
    }
    eachPlayer(no, html) {
        let name = html.split("<br>")[0];
        let vital = /生存中/.test(html) ? "alive" : "death";
        return new Player({
            no: no,
            name: name,
            vital: vital,
        });
    }
    player() {
        let players = [];
        $("#w_player")
            .find("td:odd")
            .each((i, v) => {
            let html = $(v).html();
            if (!html)
                return false;
            let player = this.eachPlayer(i, html);
            players.push(player);
        });
        return players;
    }
    discuss() {
        let logs = [];
        if (!this.isDaytime)
            return [];
        $("#w_discuss")
            .find("tr")
            .each((i, tr) => {
            if ($(tr).children().length == 2) {
                let name = $(tr).children().eq(0).find("b").eq(0).html();
                let content = $(tr).children().eq(1).html();
                let namehtml = $(tr).children().eq(0).html();
                let colorhtml = namehtml.match(/color="(.+?)"/);
                let color = colorhtml ? colorhtml[1] : "#000000";
                let contenthtml = $(tr).children().eq(1).html();
                let size = contenthtml.includes('size="+1"') ? "big" :
                    contenthtml.includes('size="-1"') ? "small" : "normal";
                let log = new Log({
                    name: name,
                    color: color,
                    size: size,
                    content: content,
                });
                logs.push(log);
            }
        });
        return logs;
    }
    isUnvote() {
        return /<font size="\+2">投票/.test($("body").html());
    }
}
class SikigamiParser extends AbstParser {
    constructor() {
        super();
    }
    body() {
        return $("body");
    }
    villageNo() {
        return location.href.match(/room_no=(\d+)/)[1];
    }
    today() {
        var timetable = $("table.time-table");
        if (timetable.length == 0) {
            return 0;
        }
        var day = timetable.eq(0).html().match(/(\d+) 日目/);
        return day ? +day[1] - 1 : 0;
    }
    isDaytime() {
        return !/game_night\.css/.test($("head").html());
    }
    vital() {
        let vitals = [];
        this.body()
            .find("div.player table td:odd")
            .each((i, v) => {
            if (!$(v).html())
                return false;
            vitals.push(/生存中/.test($(v).html()) ? "alive" : "death");
        });
        return vitals;
    }
    death() {
        let deathList = [];
        let result = {};
        $("table.dead-type td")
            .each((i, tr) => {
            if (/(で発見|結果処刑|突然死|猫又の呪い)/.test($(tr).text())) {
                deathList.push(tr);
            }
        });
        let day = this.today();
        let cantco = this.today();
        let isdaytime = this.isDaytime();
        for (let log of deathList) {
            let cn = $(log).text().split(" は")[0];
            let text = $(log).text();
            let reason = "";
            if (/無残な姿/.test(text))
                reason = "bite";
            if (/死体で発見/.test(text))
                reason = "note";
            if (/投票の結果|猫又の呪い/.test(text)) {
                reason = "exec";
                isdaytime ? day-- : cantco++;
            }
            if (/突然死/.test(text)) {
                reason = "sudden";
                cantco++;
            }
            result[cn] = {
                reason: reason,
                cantco: cantco,
                day: day,
            };
        }
        return result;
    }
    vote() {
        let result = {};
        let tables = $("table.vote-list");
        if (!tables.length)
            return result;
        tables.each((i, table) => {
            let day = $(table).find("td").eq(0).text().match(/(\d+) 日目/)[1];
            $(table)
                .find("tr")
                .each((i, vote) => {
                let voter = $(vote).find(".vote-name").eq(0).text();
                let target = $(vote).find(".vote-name").eq(1).text();
                if (voter) {
                    if (!result[voter]) {
                        result[voter] = { day: +day, targets: [] };
                    }
                    result[voter].targets.push(target);
                }
            });
        });
        return result;
    }
    eachPlayer(no, html) {
        let name = html.split("<br>")[0].split(">").pop();
        let vital = /生存中/.test(html) ? "alive" : "death";
        return new Player({
            no: no,
            name: name,
            vital: vital,
        });
    }
    player() {
        let players = [];
        this.body()
            .find("div.player table td:odd")
            .each((i, v) => {
            let html = $(v).html();
            if (!html)
                return false;
            let player = this.eachPlayer(i, html);
            players.push(player);
        });
        return players;
    }
    discuss() {
        let logs = [];
        if (!this.isDaytime)
            return [];
        this.body()
            .find("tr.user-talk")
            .each((i, tr) => {
            let name = $(tr).find("td.user-name").text().slice(1);
            let content = $(tr).children().eq(1).html();
            let namehtml = $(tr).find("td.user-name").html();
            let color = namehtml.match(/color="(.+?)"/)[1];
            let log = new Log({
                name: name,
                color: color,
                content: content,
                size: "normal"
            });
            logs.push(log);
        });
        return logs;
    }
    isUnvote() {
        return this.isDaytime() && $(".system-vote").length > 0;
    }
}
class MeatMemo {
    constructor(serverName) {
        this.serverName = serverName || "wakamete";
        switch (this.serverName) {
            case "wakamete":
                this.parser = new WakameteParser();
                break;
            case "sikigami":
                this.parser = new SikigamiParser();
                break;
        }
        this.playerManager = new PlayerManager(this);
        this.log = new LogManager(this);
        this.setting = new Setting(this);
        this.colorSetting = new ColorSetting(this);
        this.random = new Random(this);
        this.style = new Style(this);
        this.utility = new Utility(this);
        this.filterSetting = { show: "All", input: "simple" };
        this.isAutoReload = false;
        this.newestImportDay = 0;
        this.init();
    }
    init() {
        if (/game_up/.test(location.href))
            return false;
        this.load();
        this.prepare();
        this.setting.init();
        this.colorSetting.init();
        this.style.injection();
        this.random.init();
        $(() => {
            this.on();
        });
    }
    get playerNum() {
        this.playerManager.import();
        return this.playerManager.list.length;
    }
    settingIs(key, value = "yes") {
        return this.setting.options[key].value == value;
    }
    settingValue(key) {
        return this.setting.options[key].value;
    }
    prepare() {
        let container = `
<div id="memoContainer">
<!--
<div id="memoMenu">
</div>
-->
<div id="memoTab">
    <div class='tab active' data-value='log'>発言ログ</div>
    <div class='tab' data-value='vote'>投票履歴</div>
    <div class='button' id='importButton'>ログの取り込み</div>
    <div class='button' id='resetButton'>リセット</div>
    <div class='button' id='reloadButton'>更新</div>
</div>

<div id="memoBody">

<div id="logArea">

    <div id="playerInfoArea">
        <table id="playerInfoTable"></table>
    </div>

    <div id="buttonArea">
        <div>絞り込み
        <div class='select filter' data-value='All'>全員表示</div><div class='select filter' data-value='Alive'>生存+役職のみ</div>
        </div>

        <div>役職入力
        <div class='select inputmode' data-value='none'>なし</div><div class='select inputmode' data-value='simple'>最新のみ</div><div class='select inputmode' data-value='full'>全日</div>
        </div>
    </div>

    <div id="discussLogArea">
        <table id="discussLogTable"></table>
    </div>

</div>

<div id="voteArea">
    <table id="voteTable"></table>
    <table id="summaryTable"></table>
</div>

</div>

</div>  
        `;
        let float = `
        <div id="floatButtonArea">
            <div id='toolArea'>
            <a>ツール</a>
            <div id='toolArea_hid'></div>
            </div>

            <div>
                <a id='toggleButton'>メモ表示/非表示</a>
            </div>       
        </div>
        `;
        $("body").append(container).append(float);
        this.switchInputMode();
        this.switchAliveFilter();
        let _this = this;
        $("#toggleButton").on("click", () => {
            $("#memoContainer").toggle();
        });
        $("#importButton").on("click", () => {
            this.import();
            this.refresh();
        });
        $("#resetButton").on("click", () => {
            if (!window.confirm("ログをすべてリセットします。本当によろしいですか？"))
                return false;
            this.reset();
            this.refresh();
        });
        $("div.tab").on("click", function () {
            let mode = $(this).data("value");
            _this.switchDispArea(mode);
        });
        $("div.select.filter").on("click", function () {
            let mode = $(this).data("value");
            _this.switchAliveFilter(mode);
        });
        $("div.select.inputmode").on("click", function () {
            let mode = $(this).data("value");
            _this.switchInputMode(mode);
        });
        $("#toolArea").hover(() => {
            $("#toolArea_hid").show();
        }, () => {
            $("#toolArea_hid").hide();
        });
    }
    autoImport() {
        if (this.settingIs("auto_import_log", "alltime")) {
            this.import();
        }
        else if (this.settingIs("auto_import_log", "onetime")) {
            let today = this.today;
            if (today > this.newestImportDay && this.parser.isUnvote()) {
                this.newestImportDay = today;
                this.import();
            }
        }
    }
    import() {
        this.playerManager.import();
        this.log.import();
        this.message("ログを取り込みました。");
        this.save();
    }
    refresh() {
        this.playerManager.refresh();
        this.log.refresh();
    }
    switchDispArea(mode) {
        $("div.tab").removeClass("active");
        $(`div.tab[data-value=${mode}]`).addClass("active");
        $("#memoBody > div").hide();
        $(`#${mode}Area`).show();
    }
    reset() {
        this.playerManager.reset();
        this.log.reset();
        this.save();
    }
    switchAliveFilter(mode) {
        mode = mode || this.filterSetting.show;
        this.filterSetting.show = mode;
        $("div.select.filter").removeClass("active");
        $(`div.select.filter[data-value=${mode}]`).addClass("active");
        this.playerManager.filter(mode);
        this.save();
    }
    switchInputMode(mode) {
        mode = mode || this.filterSetting.input;
        this.filterSetting.input = mode;
        $("div.select.inputmode").removeClass("active");
        $(`div.select.inputmode[data-value=${mode}]`).addClass("active");
        let newestDay = this.newestDay;
        for (var day = 1; day <= newestDay; day++) {
            if (mode == "full" || (mode == "simple" && day == newestDay)) {
                $("#result_" + day).show();
            }
            else {
                $("#result_" + day).hide();
            }
        }
        this.save();
    }
    on() {
        if (this.serverName == "wakamete") {
            this.addUtility_wakamete();
        }
        $(window).on("keydown", function (e) {
            if (e.keyCode == 27) {
                $("#memoContainer").hide();
            }
        });
        this.autoImport();
        this.refresh();
    }
    addUtility_wakamete() {
        $("table").eq(1).attr("id", "w_player");
        $("table[cellspacing=0]").eq(-1).attr("id", "w_textarea");
        $("table[cellpadding=0]").not(".CLSTABLE2").last().attr("id", "w_discuss");
        $("table[cellspacing=0]").eq(0).attr("id", "w_info");
        $("table[cellspacing=0]").eq(-2).attr("id", "w_command");
        let voicebutton = [
            "<td class='voiceloud'>",
            "<div class='voice' data-value='MSG'>普</div>",
            "<div class='voice' data-value='MSG2'><strong>強</strong></div>",
            "<div class='voice' data-value='MSG3'><span style='color:#6666ee;'>弱</span></div>",
            "</td>",
        ].join("");
        let submitbutton = "<td><input type='submit' value='行動/更新' style='height:100px; width:150px;'></td>";
        $("#w_textarea").find("td:last").after(submitbutton).after(voicebutton);
        $("textarea").eq(0).focus();
        $("div.voice").on("click", function () {
            $("select").eq(0).val($(this).data("value"));
            $("div.voice").removeClass("voice_selected");
            $(this).addClass("voice_selected");
        });
        $("#reloadButton").on("click", function () {
            $("textarea").val("");
            document.forms[0].submit();
        });
    }
    toggleAutoReload() {
        this.isAutoReload = !this.isAutoReload;
        this.save();
    }
    get villageNo() {
        return this.parser.villageNo();
    }
    load() {
        let sdata = localStorage.getItem("memodata");
        if (!sdata)
            return false;
        let memodata = JSON.parse(sdata);
        this.isAutoReload = memodata.isAutoReload;
        if (memodata.villageNo != this.villageNo)
            return false;
        this.playerManager.load(memodata.playerInfo);
        this.log.load(memodata.discussLog);
        if (memodata.filterSetting) {
            this.filterSetting = memodata.filterSetting;
        }
        this.newestImportDay = memodata.newestImportDay || 0;
        this.save();
    }
    save() {
        let data = {
            villageNo: this.villageNo,
            playerInfo: this.playerManager.forSave(),
            discussLog: this.log.forSave(),
            filterSetting: this.filterSetting,
            isAutoReload: this.isAutoReload,
            newestImportDay: this.newestImportDay,
        };
        localStorage.setItem("memodata", JSON.stringify(data));
    }
    filterLog(no = 99, day = 99) {
        if (no < 99) {
            $("#discussLogTable tr").hide();
            $("tr.systemlog").show();
            $("tr.talk_player" + no).show();
        }
        else {
            $("#discussLogTable tr").show();
        }
        if (day < 99) {
            $("#discussLogTable tbody").hide();
            $("#log_day" + day).show();
        }
        else {
            $("#discussLogTable tbody").show();
        }
    }
    message(text, sec = 3) {
        $("#header-message").remove();
        $("<div></div>")
            .addClass("message")
            .attr("id", "header-message")
            .text(text)
            .prependTo("#floatButtonArea");
        setTimeout(() => $("#header-message").remove(), sec * 1000);
    }
    get today() {
        return this.parser.today();
    }
    get newestDay() {
        return Math.max(this.today, this.log.list.length - 1);
    }
    get isDaytime() {
        return this.parser.isDaytime();
    }
    get isStart() {
        return this.log.list.length >= 2;
    }
}
class Player {
    constructor(data) {
        this.no = data.no || 0;
        this.name = data.name || "";
        this.vital = data.vital || "alive";
        this.job = data.job || "gray";
        this.reasoning = data.reasoning || "gray";
        this.jobresult = data.jobresult || [];
        this.vote = data.vote || [];
        this.death = data.death || { reason: null, day: null, cantco: 99 };
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
        };
    }
    updateVital(vital) {
        this.vital = vital;
    }
    setJudge(day, judge) {
        this.jobresult.fillundef({ target: 99, judge: "notinput" }, +day);
        this.jobresult[day].judge = judge;
    }
    setTarget(day, target) {
        this.jobresult.fillundef({ target: 99, judge: "notinput" }, +day);
        this.jobresult[day].target = target;
    }
    canCO(day) {
        switch (this.job) {
            case "fortune":
                return day < this.death.cantco;
            case "necro":
                return day < this.death.cantco && day > 1;
            default:
                return false;
        }
    }
    jobInitial() {
        return jobinitial[this.reasoning] + jobinitial[this.job];
    }
}
class PlayerManager {
    constructor(memo) {
        this.list = [];
        this.indexOfName = {};
        this.memo = memo;
    }
    reset() {
        this.list = [];
        this.indexOfName = {};
    }
    load(data) {
        if (!data)
            return false;
        this.list = [];
        this.indexOfName = {};
        for (let p of data) {
            let player = new Player(p);
            this.list.push(player);
            this.indexOfName[player.name] = player.no;
        }
    }
    pick(name) {
        if (name in this.indexOfName) {
            return this.list[this.indexOfName[name]];
        }
        else {
            return null;
        }
    }
    forSave() {
        return this.list.map((player) => player.forSave());
    }
    filter(mode) {
        for (var player of this.list) {
            if (mode == "All" || player.vital == "alive" || player.job != "gray") {
                $("td.player_" + player.no).show();
            }
            else {
                $("td.player_" + player.no).hide();
            }
        }
    }
    import() {
        if (this.memo.isStart) {
            this.vitalCheck();
        }
        else {
            this.update();
        }
        this.import_vote();
        this.import_death();
    }
    no(name) {
        if (name in this.indexOfName) {
            return this.indexOfName[name];
        }
        else {
            return "";
        }
    }
    vitalCheck() {
        let vitals = this.memo.parser.vital();
        for (let [i, vital] of vitals.entries()) {
            this.list[i].updateVital(vital);
        }
    }
    update() {
        let players = this.memo.parser.player();
        this.list = players.map((p) => new Player(p));
        this.indexOfName = {};
        for (let [i, player] of this.list.entries()) {
            this.indexOfName[player.name] = i;
        }
    }
    import_death() {
        let deathList = this.memo.parser.death();
        for (let cn in deathList) {
            let player = this.pick(cn);
            player.death = deathList[cn];
        }
    }
    import_vote() {
        let votes = this.memo.parser.vote();
        if (!Object.keys(votes).length)
            return false;
        let day = votes[Object.keys(votes)[0]].day;
        let votenum = votes[Object.keys(votes)[0]].targets.length;
        for (let player of this.list) {
            player.vote.fillundef(["-"], day);
            if (player.name in votes) {
                player.vote[day] = votes[player.name].targets;
            }
            else {
                player.vote[day].fillundef("-", votenum - 1);
            }
        }
    }
    listforSelect() {
        let playersList = { 99: "" };
        for (let player of this.list) {
            playersList[player.no] = player.name;
        }
        return playersList;
    }
    refresh() {
        this.refreshPlayer();
        this.refreshVote();
        this.refreshSummary();
    }
    refreshPlayer() {
        let playerInfoTable = $("#playerInfoTable");
        playerInfoTable.empty();
        if (!this.list.length)
            return false;
        let playersList = this.listforSelect();
        let newestDay = this.memo.newestDay;
        let namerow = $("<tr></tr>").addClass("namerow");
        let a = $("<a></a>").attr("id", "filterlink_99_99").text("全ログ");
        $("<td></td>")
            .append(a)
            .appendTo(namerow);
        for (let player of this.list) {
            let a = $("<a></a>")
                .text(player.name)
                .attr("id", `filterlink_${player.no}_99`);
            $("<td></td>")
                .append(a)
                .addClass(`player_${player.no}`)
                .appendTo(namerow);
        }
        namerow.appendTo(playerInfoTable);
        let jobrow = $("<tr></tr>").addClass("jobrow");
        $("<td></td>").text("CO").appendTo(jobrow);
        for (let player of this.list) {
            let select = createSelectBox(joblist, player.job, {
                id: `player_${player.no}_job`,
                class: "jobselect",
            });
            $("<td></td>").append(select).addClass("player_" + player.no).appendTo(jobrow);
        }
        jobrow.appendTo(playerInfoTable);
        let reasoningrow = $("<tr></tr>").addClass("jobrow");
        $("<td></td>").text("推理").appendTo(reasoningrow);
        for (let player of this.list) {
            let select = createSelectBox(reasoninglist, player.reasoning, {
                id: `player_${player.no}_reasoning`,
                class: "reasoningselect",
            });
            $("<td></td>").append(select).addClass("player_" + player.no).appendTo(reasoningrow);
        }
        reasoningrow.appendTo(playerInfoTable);
        for (let day = 1; day <= newestDay; day++) {
            let row = $("<tr></tr>").addClass("talknumrow");
            let a = $("<a></a>").text(`${day + 1}日目`).attr("id", `filterlink_99_${day}`);
            $("<td></td>")
                .append(a)
                .appendTo(row);
            for (let player of this.list) {
                let no = player.no;
                let talknum = this.memo.log.talknum(player.name, day);
                let td = $("<td></td>").addClass(`player_${no}`);
                if (talknum) {
                    $("<a></a>")
                        .text(talknum)
                        .attr("id", `filterlink_${no}_${day}`)
                        .appendTo(td);
                }
                td.appendTo(row);
            }
            row.appendTo(playerInfoTable);
        }
        for (let day = 1; day <= newestDay; day++) {
            let resultrow = $("<tr></tr>").attr("id", "result_" + day).addClass("resultrow");
            $("<td></td>").text(`占霊結果 ${day + 1}日目`).appendTo(resultrow);
            for (let player of this.list) {
                if (player.canCO(day)) {
                    let select1 = createSelectBox(playersList, 99, {
                        id: `target_${player.no}_${day}`,
                        class: "jobtarget",
                    });
                    let select2 = createSelectBox(resultlist, "notinput", {
                        id: `judge_${player.no}_${day}`,
                        class: "jobjudge",
                    });
                    $("<td></td>")
                        .append(select1)
                        .append(select2)
                        .addClass("player_" + player.no)
                        .appendTo(resultrow);
                }
                else {
                    $("<td></td>")
                        .addClass("player_" + player.no)
                        .appendTo(resultrow);
                }
            }
            playerInfoTable.append(resultrow);
        }
        this.refreshJobResult();
        this.memo.switchAliveFilter();
        this.memo.switchInputMode();
        this.coloringGray();
        let _this = this;
        $("#playerInfoTable a").on("click", function (e) {
            let id = $(this).attr("id");
            if (!id)
                return false;
            let no = +id.split("_")[1];
            let day = +id.split("_")[2];
            _this.memo.filterLog(no, day);
        });
        $("select.jobselect").on("change", function (e) {
            let id = $(this).attr("id");
            if (!id)
                return false;
            let [i, no, day] = id.split("_");
            _this.list[+no].job = String($(this).val());
            _this.refresh();
            _this.refreshJobInitial();
            _this.coloring();
            _this.memo.save();
        });
        $("select.reasoningselect").on("change", function (e) {
            let id = $(this).attr("id");
            if (!id)
                return false;
            let [i, no, day] = id.split("_");
            _this.list[+no].reasoning = String($(this).val());
            _this.refreshJobInitial();
            _this.coloring();
            _this.memo.save();
        });
        $("select.jobtarget").on("change", function (e) {
            let id = $(this).attr("id");
            if (!id)
                return false;
            let no = +id.split("_")[1];
            let day = +id.split("_")[2];
            let target = +$(this).val();
            _this.list[no].setTarget(day, target);
            _this.refreshSummary();
            _this.coloringGray();
            _this.memo.save();
        });
        $("select.jobjudge").on("change", function (e) {
            let id = $(this).attr("id");
            if (!id)
                return false;
            let [i, no, day] = id.split("_");
            let judge = String($(this).val());
            _this.list[+no].setJudge(+day, judge);
            _this.refreshSummary();
            _this.coloringGray();
            _this.memo.save();
        });
    }
    refreshVote() {
        if (!this.list.length)
            return false;
        let voteTable = $("#voteTable");
        let newestDay = this.memo.newestDay;
        voteTable.empty();
        let tr = $("<tr></tr>");
        $("<td></td>").text("プレイヤー").appendTo(tr);
        for (var day = 1; day <= newestDay; day++) {
            if (!this.list[0].vote[day])
                continue;
            let colspan = this.list[0].vote[day].length;
            $("<td></td>").text(`${day + 1}日目`).attr("colspan", colspan).appendTo(tr);
        }
        voteTable.append(tr);
        for (var player of this.list) {
            let tr = $("<tr></tr>");
            $("<td></td>").text(player.name).appendTo(tr);
            for (day = 1; day <= newestDay; day++) {
                if (!player.vote[day])
                    continue;
                for (let vote of player.vote[day]) {
                    $("<td></td>").text(vote).appendTo(tr);
                }
            }
            voteTable.append(tr);
        }
    }
    refreshJobResult() {
        let newestDay = this.memo.newestDay;
        let fortunes = this.list.filter((p) => p.job == "fortune");
        for (let fortune of fortunes) {
            for (let day = 1; day < Math.min(fortune.death.cantco, newestDay + 1); day++) {
                if (!fortune.jobresult[day])
                    continue;
                $("#target_" + fortune.no + "_" + day).val(fortune.jobresult[day].target);
                $("#judge_" + fortune.no + "_" + day).val(fortune.jobresult[day].judge);
            }
        }
        let necros = this.list.filter((p) => p.job == "necro");
        for (let necro of necros) {
            for (let day = 2; day < Math.min(necro.death.cantco, newestDay + 1); day++) {
                let exec = this.list.filter((p) => p.death.day == day - 1 && p.death.reason == "exec");
                if (necro.jobresult[day]) {
                    $("#target_" + necro.no + "_" + day).val(necro.jobresult[day].target);
                    $("#judge_" + necro.no + "_" + day).val(necro.jobresult[day].judge);
                }
                else if (exec.length) {
                    $("#target_" + necro.no + "_" + day).val(exec[0].no);
                }
            }
        }
    }
    refreshSummary() {
        let summaryTable = $("#summaryTable");
        let newestDay = this.memo.newestDay;
        summaryTable.empty();
        var tr = $("<tr></tr>");
        $("<td></td>").attr("colspan", 2).appendTo(tr);
        for (var day = 1; day <= newestDay; day++) {
            $("<td></td>").text(`${day + 1}日目`).appendTo(tr);
        }
        tr.appendTo(summaryTable);
        var fortunes = this.list.filter((p) => p.job == "fortune");
        let necros = this.list.filter((p) => p.job == "necro");
        let ability = fortunes.concat(necros);
        for (let player of ability) {
            let tr = $("<tr></tr>");
            $("<td></td>").text(player.job == "fortune" ? "占い師" : "霊能者").appendTo(tr);
            $("<td></td>").text(player.name).appendTo(tr);
            for (day = 1; day <= newestDay; day++) {
                let name = "", judge = "";
                if (player.jobresult[day] && player.jobresult[day].target != 99) {
                    let result = player.jobresult[day];
                    name = this.list[result.target].name;
                    judge = resultlist[result.judge];
                }
                $("<td></td>").text(name + judge).appendTo(tr);
            }
            tr.appendTo(summaryTable);
        }
        for (var reason in reasonflavor) {
            let deaths = this.list.filter((p) => p.death.reason == reason);
            if (!deaths.length)
                continue;
            let tr = $("<tr></tr>");
            $("<td></td>").text(reasonflavor[reason]).attr("colspan", 2).appendTo(tr);
            for (day = 1; day <= newestDay; day++) {
                let cns = deaths.filter((p) => p.death.day == day).map((p) => p.name);
                let td = $("<td></td>");
                for (let cn of cns) {
                    $("<div></div>").text(cn).appendTo(td);
                }
                td.appendTo(tr);
            }
            tr.appendTo(summaryTable);
        }
    }
    refreshJobInitial() {
        for (let player of this.list) {
            $("tr.talk_player" + player.no + " span").text(player.jobInitial());
        }
    }
    coloringGray() {
        let co = this.list.filter((p) => p.job != "gray").map((p) => p.no);
        var fortunes = this.list.filter((p) => p.job == "fortune");
        if (this.memo.settingIs("grayregion")) {
            fortunes = fortunes.filter((f) => f.reasoning == "gray" || f.reasoning == "real");
        }
        let fortuned = fortunes.map((f) => f.jobresult.map((r) => +r.target)).flat();
        let notgray = co.concat(fortuned);
        $("tr.namerow td").removeClass("death").removeClass("gray");
        for (var player of this.list) {
            if (player.vital == "death") {
                $("tr.namerow .player_" + player.no).addClass("death");
            }
            else if (!notgray.includes(player.no)) {
                $("tr.namerow .player_" + player.no).addClass("gray");
            }
        }
    }
    coloring() {
        if (!this.memo.settingIs("coloringName"))
            return false;
        $("#w_discuss b").each((i, e) => {
            let name = $(e).text();
            let player = this.pick(name);
            if (player) {
                let job = player.job;
                let color = this.memo.colorSetting.pick(job);
                $(e).removeClass().addClass(color);
            }
        });
    }
}
class Log {
    constructor(data) {
        this.name = data.name;
        this.color = data.color;
        this.size = data.size;
        this.content = data.content;
    }
    forSave() {
        return {
            name: this.name,
            color: this.color,
            content: this.content,
            size: this.size
        };
    }
}
class LogManager {
    constructor(memo) {
        this.memo = memo;
        this.list = [];
    }
    reset() {
        this.list = [];
    }
    load(data) {
        if (!data)
            return false;
        this.list = [];
        data.forEach((logs) => {
            let logofday = [];
            logs.forEach((d) => {
                let log = new Log(d);
                logofday.push(log);
            });
            this.list.push(logofday);
        });
    }
    forSave() {
        let result = [];
        this.list.forEach((logs) => {
            let l = logs.map((log) => log.forSave());
            result.push(l);
        });
        return result;
    }
    talknum(name, day) {
        if (!this.list[day])
            return 0;
        return this.list[day].filter((l) => l.name == name).length;
    }
    import() {
        this.import_discuss();
        this.memo.filterLog();
    }
    import_discuss() {
        let today = this.memo.today;
        let isDaytime = this.memo.isDaytime;
        if (!isDaytime)
            return false;
        this.list.fillundef([], today);
        this.list[today] = this.memo.parser.discuss();
    }
    refresh() {
        let discussLogTable = $("#discussLogTable");
        discussLogTable.empty();
        if (!this.list.length)
            return false;
        this.list.forEach((logs, day) => {
            if (!logs)
                return;
            let tbody = $("<tbody></tbody>", { id: "log_day" + day });
            let tr = $("<tr></tr>").addClass("systemlog");
            $("<td></td>").attr("colspan", 2).text(`${day + 1}日目`).appendTo(tr);
            tr.appendTo(tbody);
            for (let log of logs) {
                let cl = "talk_player" + this.memo.playerManager.no(log.name);
                let tr = $("<tr></tr>").addClass(cl);
                let td = $("<td></td>");
                if (log.name == "ゲームマスター") {
                    $("<font></font>")
                        .attr("color", log.color)
                        .text("◆")
                        .append($("<b></b>").text(log.name))
                        .appendTo(td);
                }
                else {
                    $("<font></font>")
                        .attr("color", log.color)
                        .text("◆")
                        .appendTo(td);
                    $("<b></b>")
                        .text(log.name)
                        .appendTo(td);
                    $("<font></font>")
                        .text("さん")
                        .appendTo(td);
                }
                $("<span></span>").addClass("jobinitial").appendTo(td);
                td.appendTo(tr);
                let content = log.content
                    .replace(/<br>/g, "\n")
                    .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
                    .replace(/\n/g, "<br>");
                $("<td></td>").addClass(log.size).html(content).appendTo(tr);
                tr.appendTo(tbody);
            }
            tbody.prependTo(discussLogTable);
        });
        this.memo.playerManager.refreshJobInitial();
    }
}
class SettingOption {
    constructor(data) {
        this.value = data.value;
        this.option = data.option;
        this.default = data.value;
        this.name = data.name;
    }
}
class ColorSetting {
    constructor(memo) {
        this.memo = memo;
        this.options = {};
    }
    pick(job) {
        return this.options[job].value;
    }
    init() {
        for (let key in colorSettingDefault) {
            this.options[key] = new SettingOption(colorSettingDefault[key]);
        }
        this.load();
        let settingArea = $("<div></div>", {
            id: "colorSetting",
            class: "window southEast",
        }).appendTo($("body"));
        $("#toolArea_hid").append("<a id='dispcolorSetting'>名前色設定</a>");
        let settingTable = $("<table></table>", { id: "colorSettingtable" }).appendTo(settingArea);
        settingArea.append(`<div class="closebutton"><input type="button" id="closeColorSetting" value='閉じる'></div>`);
        $("#dispcolorSetting").on("click", () => {
            $("#colorSetting").show();
        });
        $("#closeColorSetting").on("click", () => {
            $("#colorSetting").hide();
        });
        for (let key in this.options) {
            let item = this.options[key];
            let tr = $("<tr></tr>");
            let select = createSelectBox(item.option, item.value, { id: key });
            $("<td></td>").text(item.name).appendTo(tr);
            $("<td></td>").append(select).appendTo(tr);
            tr.appendTo(settingTable);
        }
        let _this = this;
        $("#colorSetting select").on("change", function () {
            let val = $(this).val();
            _this.setValue($(this).attr("id"), String(val));
            _this.coloring();
        });
    }
    coloring() {
        this.memo.playerManager.coloring();
    }
    setValue(key, value) {
        if (!(key in this.options))
            return false;
        this.options[key].value = value;
        this.save();
    }
    load() {
        let s = localStorage.getItem("memoColorSetting");
        if (!s)
            return false;
        let data = JSON.parse(s);
        for (let key in data) {
            if (key in this.options) {
                this.options[key].value = data[key];
            }
        }
    }
    save() {
        localStorage.setItem("memoColorSetting", JSON.stringify(this.forSave()));
    }
    forSave() {
        let result = {};
        for (let key in this.options) {
            result[key] = this.options[key].value;
        }
        return result;
    }
}
class Setting {
    constructor(memo) {
        this.memo = memo;
        this.options = {};
        this.load();
    }
    init() {
        let settingArea = $("<div></div>", { id: "setting", class: "window southEast" }).appendTo(this.memo.parser.body());
        $("#toolArea_hid").append("<a id='dispsetting'>設定</a>");
        let settingTable = $("<table></table>", { id: "settingtable" }).appendTo(settingArea);
        settingArea.append(`<div class="closebutton"><input type="button" id="closeSetting" value='閉じる'></div>`);
        $("#dispsetting").on("click", () => {
            $("#setting").show();
        });
        $("#closeSetting").on("click", () => {
            $("#setting").hide();
        });
        for (let key in this.options) {
            let item = this.options[key];
            let tr = $("<tr></tr>");
            let select = createSelectBox(item.option, item.value, { id: key });
            $("<td></td>").text(item.name).appendTo(tr);
            $("<td></td>").append(select).appendTo(tr);
            tr.appendTo(settingTable);
        }
        let _this = this;
        $("#setting select").on("change", function () {
            let key = $(this).attr("id");
            let val = String($(this).val());
            _this.setValue(key, val);
        });
    }
    setValue(key, value) {
        if (!(key in this.options))
            return false;
        this.options[key].value = value;
        this.save();
    }
    load() {
        for (let key in settingDefault) {
            this.options[key] = new SettingOption(settingDefault[key]);
        }
        let s = localStorage.getItem("memoSetting");
        if (!s)
            return false;
        let data = JSON.parse(s);
        for (let key in data) {
            if (key in this.options) {
                this.options[key].value = data[key];
            }
        }
    }
    save() {
        localStorage.setItem("memoSetting", JSON.stringify(this.forSave()));
    }
    forSave() {
        let result = {};
        for (let key in this.options) {
            result[key] = this.options[key].value;
        }
        return result;
    }
}
class Random {
    constructor(memo) {
        this.memo = memo;
    }
    init() {
        if (this.memo.serverName != "wakamete") {
            return false;
        }
        let randomWindow = `
            <div id="random" class="window southEast">

            <div class="closebutton">
            <input type="button" id="closeRandom" value='閉じる'>
            </div>
    
            <input type="button" value="4桁乱数" id="random_rnd4">
            <input type="button" value="乱数表" id="random_matrix">
            <input type="button" value="背徳用数字" id="random_haitoku">
            <br>
            <textarea id="forCopy" style="width:200px;height:150px;"></textarea>
            <div id='randomMessage'></div>       
            </div>
        `;
        $("body").append(randomWindow);
        $("#toolArea_hid").append("<a id='dispRandom'>乱数</a>");
        $("#dispRandom").on("click", () => {
            $("#random").show();
        });
        $("#closeRandom").on("click", () => {
            $("#random").hide();
        });
        $("#random_rnd4").on("click", () => {
            this.copy(this.rnd4());
        });
        $("#random_matrix").on("click", () => {
            this.copy(this.matrix());
        });
        $("#random_haitoku").on("click", () => {
            this.copy(this.haitoku());
        });
    }
    copy(text) {
        $("#forCopy").val(text).select();
        document.execCommand("copy");
        $("#randomMessage").text("コピーしました。");
    }
    rnd(n) {
        return Math.floor(Math.random() * n);
    }
    padding(num, digit) {
        let txt = "0000000000" + num;
        return txt.slice(-digit);
    }
    rnd4() {
        let rnd = this.rnd(10000);
        return this.padding(rnd, 4);
    }
    matrix() {
        let num = this.memo.playerNum;
        var l = [];
        var mat = "";
        for (var i = 0; i < num; i++) {
            l[i] = this.padding(i + 1, 2);
        }
        for (i = 0; i < num; i++) {
            var r = this.rnd(num - i);
            mat += l[r];
            mat += i % 5 == 4 ? "\n" : " / ";
            for (var j = r; j < num - 1; j++) {
                l[j] = l[j + 1];
            }
        }
        return mat;
    }
    haitoku() {
        let num = this.memo.playerNum;
        var jobs = ["村　人", "占い師", "霊能者", "狩　人", "共有者", "狂　人", "背徳者"];
        var cir = ["①", "②", "③", "④", "⑤", "⑥", "⑦"];
        var result = "";
        var isimo = num == 15 || num == 19;
        var n = isimo ? 7 : 6;
        if (isimo) {
            result += cir[this.rnd(n)] + "\n\n";
        }
        var l = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = 0; i < n; i++) {
            let r = this.rnd(10 - i);
            let rnd = this.padding(this.rnd(100), 2);
            result = result + jobs[i] + "：" + l[r] + rnd + "\n";
            l.splice(r, 1);
        }
        return result;
    }
}
class Style {
    constructor(memo) {
        this.memo = memo;
    }
    injection() {
        let theme = this.memo.settingValue("theme_color");
        let theme_color = themeList[theme].main;
        let sub_color = themeList[theme].sub;
        if (this.memo.settingIs("layout")) {
            $("#memoContainer").addClass("layout-side");
        }
        else {
            $("#memoContainer").addClass("layout-normal");
        }
        $("<style></style>").text(`:root{--theme-color:${theme_color}; --sub-color:${sub_color};}`).appendTo($("head"));
    }
}
class Utility {
    constructor(memo) {
        this.memo = memo;
        this.setting = memo.setting;
        this.left = 0;
        this.autoReloadFlg = 0;
        $(() => {
            this.init();
        });
    }
    init() {
        if (/game_play/.test(location.href))
            return false;
        this.receiveKeyResponse();
        if (this.memo.serverName != "wakamete")
            return false;
        this.memo.playerManager.coloring();
        this.setAlertVote();
        this.dispSuggest();
        this.highlightDeathnote();
        this.setAutoReload();
    }
    setAutoReload() {
        if ($("td.CLSTD01").eq(1).text() != "◆ 再表示")
            return false;
        let isAutoReload = this.memo.isAutoReload;
        let onoff = isAutoReload ? "ON" : "OFF";
        let a = $("<a></a>").attr("id", "autoReload").text("自動更新：" + onoff);
        let div = $("<div></div>").append(a);
        $("#floatButtonArea").prepend(div);
        if (isAutoReload)
            this.setReloadTimer();
        $("#autoReload").on("click", () => {
            this.memo.toggleAutoReload();
            let isAutoReload = this.memo.isAutoReload;
            let onoff = isAutoReload ? "ON" : "OFF";
            $("#autoReload").text("自動更新：" + onoff);
            if (isAutoReload) {
                this.setReloadTimer();
            }
            else {
                clearTimeout(this.autoReloadFlg);
            }
        });
    }
    setReloadTimer() {
        this.autoReloadFlg = setTimeout(() => {
            $("textarea").eq(0).val("");
            document.forms[0].submit();
        }, +this.memo.settingValue("autoreload_interval") * 1000);
    }
    setAlertVote() {
        if (!this.memo.settingIs("alert_vote"))
            return false;
        if ($("font[size=6]").length) {
            let warningArea = $("<div></div>", { id: "warningArea" }).appendTo($("body"));
            warningArea.show();
            var cmbplayer = $("select[name=CMBPLAYER]").clone();
            var votebutton = $("<input />", {
                type: "button",
                value: "投票",
                on: {
                    click: function () {
                        $("select").eq(0).val("VOTE");
                        document.forms[0].submit();
                    },
                },
            });
            warningArea.text("未投票です！ ");
            warningArea.append(cmbplayer);
            warningArea.append(votebutton);
            cmbplayer.on("change", function () {
                let v = $(this).val();
                if (!v)
                    return false;
                $("select[name=CMBPLAYER]").val(v);
            });
        }
    }
    receiveKeyResponse() {
        if (this.memo.settingIs("send_support", "ctrl")) {
            $(window).on("keydown", function (e) {
                if (e.ctrlKey && e.keyCode == 13) {
                    setTimeout(function () {
                        $("textarea").val("");
                    }, 50);
                    var length = document.forms.length;
                    document.forms[length - 1].submit();
                }
            });
        }
        if (this.memo.settingIs("send_support", "shift")) {
            $(window).on("keydown", function (e) {
                if (e.shiftKey && e.keyCode == 13) {
                    setTimeout(function () {
                        $("textarea").val("");
                    }, 50);
                    var length = document.forms.length;
                    document.forms[length - 1].submit();
                }
            });
        }
    }
    dispSuggest() {
        var colorselect = createSelectBox(COLORLIST, 0, { id: "colorlist" });
        var coloredittd = `<td class="coloredit">アイコン色：</td>`;
        var selecttd = $("<td></td>").addClass("coloredit").append(colorselect);
        var iconsupport = "<td class='iconsupport'><input type='button' id='pasteurl' value='/../../imgbbs/img/'></td>";
        let commandtable = $("#w_command");
        commandtable.find("td").eq(1).after(coloredittd).after(selecttd).after(iconsupport);
        commandtable.find("td").eq(-2).addClass("cmbplayer");
        commandtable.find("td").eq(-1).addClass("cmbplayer");
        let _this = this;
        $("#colorlist").on("change", function () {
            _this.editSpeakField(String($(this).val()));
        });
        $("#pasteurl").on("click", () => {
            this.editSpeakField("/../../imgbbs/img/");
        });
        $("select")
            .eq(0)
            .on("change", function () {
            $("td.coloredit").hide();
            $("td.iconsupport").hide();
            $("td.cmbplayer").hide();
            if ($(this).val() == "ICONCHG") {
                $("td.coloredit").show();
            }
            else if ($(this).val() == "BCONCHG") {
                $("td.iconsupport").show();
            }
            else {
                $("td.cmbplayer").show();
            }
        });
    }
    editSpeakField(val) {
        $("textarea").eq(0).val(val);
    }
    highlightDeathnote() {
        var td = $("#w_info").find("td:last");
        if (/アナタの家の前に/.test(td.html())) {
            td.css("color", "red");
        }
    }
}
if ($("body").attr("bgcolor") != "#fee3aa") {
    const meatmemo = new MeatMemo(/cgi/.test(location.href) ? "wakamete" : "sikigami");
}
