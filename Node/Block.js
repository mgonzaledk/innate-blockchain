const { GENESIS_BLOCK } = require('./Config')
const Crypto = require('./Crypto')

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
        const timestamp = Date.now()
        const hash = Crypto.sha256(timestamp, previousBlock.hash, data)

        return new this({
            timestamp,
            previousHash: previousBlock.hash,
            data,
            hash
        })
    }
}

module.exports = Block
