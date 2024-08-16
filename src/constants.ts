export const resultlist = { notinput: "", white: "○", black: "●" }

export const joblist = {
    gray: "",
    fortune: "占い",
    necro: "霊能",
    share: "共有",
    guard: "狩人",
    cat: "猫又",
    beast: "人外",
}

export const reasoninglist = {
    gray: "",
    real: "真",
    fake: "偽",
    villager: "村人",
    madman: "狂人",
    wolf: "人狼",
    fox: "妖狐",
}

export const jobinitial = {
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
}

export type iFortuneResult = keyof typeof resultlist
export type iJob = keyof typeof joblist
export type iReasoning = keyof typeof reasoninglist

export interface iJobresult {
    target: number
    judge: iFortuneResult
}
