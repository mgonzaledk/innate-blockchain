const { GENESIS_BLOCK } = require('./Config')

class Block {
    constructor({ timestamp, previousHash, hash, data }) {
        this.timestamp = timestamp
        this.previousHash = previousHash
        this.hash = hash
        this.data = data
    }

    static createGenesis() {
        return new this(GENESIS_BLOCK)
    }

    static mineBlock({ previousBlock, data }) {
        return new this({
            timestamp: Date.now(),
            previousHash: previousBlock.hash,
            data,
            hash: 'TODO'
        })
    }
}

module.exports = Block
