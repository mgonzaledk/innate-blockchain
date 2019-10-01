const Block = require('./Block')
const { Crypto } = require('../Util')

class Blockchain {
    constructor() {
        this.chain = [ Block.createGenesis() ]
    }

    static isValid(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.createGenesis())) {
            return false
        }

        for(let i = 1; i < chain.length; ++i) {
            const { timestamp, previousHash, hash, data, nonce, difficulty } = chain[i]
            const currentPreviousHash = chain[i - 1].hash
            const currentPreviousDifficulty = chain[i - 1].difficulty

            if(previousHash !== currentPreviousHash) {
                return false
            }

            const validatedHash = Crypto.sha256(timestamp, previousHash, data, nonce, difficulty)

            if(hash !== validatedHash) {
                return false
            }

            if(Math.abs(currentPreviousDifficulty - difficulty) > 1) {
                return false
            }
        }

        return true
    }

    add({ data }) {
        const block = Block.mineBlock({
            previousBlock: this.chain[this.chain.length - 1],
            data
        })

        this.chain.push(block)
    }

    replace(chain, onSuccess) {
        if(chain.length <= this.chain.length) {
            console.error('La cadena entrante es inferior')
            return
        }

        if(!Blockchain.isValid(chain)) {
            console.error('La cadena entrante no es válida')
            return
        }

        if(onSuccess) {
            onSuccess()
        }

        this.chain = chain
    }
}

module.exports = Blockchain
