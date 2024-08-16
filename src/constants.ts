export const RESULT_LIST = { notinput: "", white: "○", black: "●" }

export const JOB_LIST = {
    gray: "",
    fortune: "占い",
    necro: "霊能",
    share: "共有",
    guard: "狩人",
    cat: "猫又",
    beast: "人外",
}

export const REASONING_LIST = {
    gray: "",
    real: "真",
    fake: "偽",
    villager: "村人",
    madman: "狂人",
    wolf: "人狼",
    fox: "妖狐",
}



export type IFortuneResult = keyof typeof RESULT_LIST
export type IJob = keyof typeof JOB_LIST
export type IReasoning = keyof typeof REASONING_LIST

export const JOB_INITIAL = {
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
} satisfies Record<IJob | IReasoning, string>

export interface IJobResult {
    target: number
    judge: IFortuneResult
}
