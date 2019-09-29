const { GENESIS_BLOCK, MINING_RATE } = require('./Config')
const Crypto = require('./Crypto')

class Block {
    constructor({ timestamp, previousHash, hash, difficulty, nonce, data }) {
        this.timestamp = timestamp
        this.previousHash = previousHash
        this.hash = hash
        this.difficulty = difficulty
        this.nonce = nonce
        this.data = data
    }

    static createGenesis() {
        return new this(GENESIS_BLOCK)
    }

    static mineBlock({ previousBlock, data }) {
        const previousHash = previousBlock.hash
        const { difficulty } = previousBlock

        let timestamp, hash
        let nonce = 0

        do {
            ++nonce
            timestamp = Date.now()
            hash = Crypto.sha256(timestamp, previousHash, difficulty, nonce, data)
        } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty))

        return new this({
            timestamp,
            previousHash,
            hash,
            difficulty,
            nonce,
            data
        })
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock

        if((timestamp - originalBlock.timestamp) > MINING_RATE) {
            return difficulty - 1
        }

        return difficulty + 1
    }
}

module.exports = Block
