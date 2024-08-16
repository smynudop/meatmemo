export interface ILog {
    name: string
    color: string
    size: string
    content: string
}

export class Log {
    name: string
    color: string
    size: string
    content: string
    constructor(data: ILog) {
        this.name = data.name
        this.color = data.color
        this.size = data.size
        this.content = data.content
    }

    forSave(): ILog {
        return {
            name: this.name,
            color: this.color,
            content: this.content,
            size: this.size
        }
    }
}