export function register() {
    if (Array.prototype.fillundef != null) return;

    Array.prototype.fillundef = function (def, lastindex) {
        lastindex = lastindex + 1 || this.length
        for (let i = 0; i < lastindex; i++) {
            if (this[i] === null || this[i] === undefined) {
                this[i] = JSON.parse(JSON.stringify(def))
            }
        }
    }
}