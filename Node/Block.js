class Block {
    constructor({ timestamp, previousHash, hash, data }) {
        this.timestamp = timestamp
        this.previousHash = previousHash
        this.hash = hash
        this.data = data
    }
}

module.exports = Block
