const { STARTING_BALANCE } = require('../Config')
const Transaction = require('./Transaction')
const { ec, Crypto } = require('../Util')

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE
        this.keyPair = ec.genKeyPair()
        this.publicKey = this.keyPair.getPublic().encode('hex')
    }

    static balance({ chain, address }) {
        let hasConductedTransaction = false
        let outputsTotal = 0

        for(let i = chain.length - 1; i > 0; --i) {
            const block = chain[i]

            for(let transaction of block.data) {
                if(transaction.input.address === address) {
                    hasConductedTransaction = true
                }

                const addressOutput = transaction.outputMap[address]

                if(addressOutput) {
                    outputsTotal += addressOutput
                }
            }

            if(hasConductedTransaction) {
                break
            }
        }

        return hasConductedTransaction ?
            outputsTotal :
            STARTING_BALANCE + outputsTotal
    }

    sign(data) {
        return this.keyPair.sign(Crypto.sha256(data))
    }

    createTransaction({ recipient, amount, chain }) {
        if(chain) {
            this.balance = Wallet.balance({ chain, address: this.publicKey })
        }

        if(amount > this.balance) {
            throw Error('La cantidad excede el balance')
        }

        return new Transaction({ senderWallet: this, recipient, amount })
    }
}

module.exports = Wallet
