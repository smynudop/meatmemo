import { MeatMemo } from "./meatmemo"
import { register } from "./utils"
import { WakameteParser } from "./Parser/WakameteParser"
import { SikigamiParser } from "./Parser/SikigamiParser"
import { IParser } from "./Parser/IParser"

register()

//村画面でないときは出さない
if ($("body").attr("bgcolor") != "#fee3aa") {
    const parser: IParser = /cgi/.test(location.href) ? new WakameteParser() : new SikigamiParser()
    const meatmemo = new MeatMemo(parser)
}