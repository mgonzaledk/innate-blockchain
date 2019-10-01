const Block = require('./Block')
const { REWARD_INPUT, MINING_REWARD } = require('../Config')
const Transaction = require('../Wallet/Transaction')
const { Crypto } = require('../Util')
const Wallet = require('../Wallet')

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

    replace(chain, validateTransactions, onSuccess) {
        if(chain.length <= this.chain.length) {
            console.error('La cadena entrante es inferior')
            return
        }

        if(!Blockchain.isValid(chain)) {
            console.error('La cadena entrante no es válida')
            return
        }

        if(validateTransactions && !this.validTransactionData({ chain })) {
            console.error('La cadena entranda contiene datos inválidos')
            return
        }

        if(onSuccess) {
            onSuccess()
        }

        this.chain = chain
    }

    validTransactionData({ chain }) {
        for(let i = 1; i < chain.length; ++i) {
            const block = chain[i]
            const transactionSet = new Set()
            let rewardTransactionCount = 0

            for(let transaction of block.data) {
                if(transaction.input.address === REWARD_INPUT.address) {
                    ++rewardTransactionCount

                    if(rewardTransactionCount > 1) {
                        console.error('Recompensa por minado excede el límite')
                        return false
                    }

                    if(Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.error('Recompensa por minado es inválida')
                        return false
                    }
                } else {
                    if(!Transaction.valid(transaction)) {
                        console.error('Transacción inválida')
                        return false
                    }

                    const trueBalance = Wallet.balance({
                        chain: this.chain,
                        address: transaction.input.address
                    })

                    if(transaction.input.amount !== trueBalance) {
                        console.error('Cantidad de balance de entrada errónea')
                        return false
                    }

                    if(transactionSet.has(transaction)) {
                        console.error('Existen transacciones repetidas en el bloque')
                        return false
                    }

                    transactionSet.add(transaction)
                }
            }
        }

        return true
    }
}

module.exports = Blockchain
