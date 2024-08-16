import { MeatMemo } from "./meatmemo"
import { register } from "./utils"

register()

//村画面でないときは出さない
if ($("body").attr("bgcolor") != "#fee3aa") {
    const meatmemo = new MeatMemo(/cgi/.test(location.href) ? "wakamete" : "sikigami")
}