declare global {
    interface Array<T> {
        fillundef(def:T, lastindex:number): void
    }
}

export {}
