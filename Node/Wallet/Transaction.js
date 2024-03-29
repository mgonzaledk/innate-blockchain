const uuid = require('uuid/v1')

const { REWARD_INPUT, MINING_REWARD } = require('../Config')
const { verifySignature } = require('../Util')

class Transaction {
    constructor({ senderWallet, recipient, amount, outputMap, input }) {
        this.id = uuid()
        this.outputMap = outputMap || this.createOutputMap({
            senderWallet,
            recipient,
            amount
        })
        this.input = input || this.createInput({
            senderWallet,
            outputMap: this.outputMap
        })
    }

    static valid(transaction) {
        const { input: { address, amount, signature }, outputMap } = transaction
        const outputTotal = Object.values(outputMap)
            .reduce((total, outputAmount) => total + outputAmount)

        if(amount !== outputTotal) {
            console.error(`Transacción inválida desde ${address}`)
            return false
        }

        if(!verifySignature({ publicKey: address, data: outputMap, signature })) {
            console.error(`Firma inválida desde ${address}`)
            return false
        }

        return true
    }

    static reward({ minerWallet }) {
        return new this({
            input: REWARD_INPUT,
            outputMap: { [minerWallet.publicKey]: MINING_REWARD }
        })
    }

    createOutputMap({ senderWallet, recipient, amount }) {
        const outputMap = {}

        outputMap[recipient] = amount
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount

        return outputMap
    }

    createInput({ senderWallet, outputMap }) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        }
    }

    update({ senderWallet, recipient, amount }) {
        if(amount > this.outputMap[senderWallet.publicKey]) {
            throw new Error('La cantidad excede el balance')
        }

        if(!this.outputMap[recipient]) {
            this.outputMap[recipient] = amount
        } else {
            this.outputMap[recipient] = this.outputMap[recipient] + amount
        }

        this.outputMap[senderWallet.publicKey] =
            this.outputMap[senderWallet.publicKey] - amount
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap })
    }
}

module.exports = Transaction
