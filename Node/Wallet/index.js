const { STARTING_BALANCE } = require('../Config')
const Transaction = require('./Transaction')
const { ec, Crypto } = require('../Util')

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE
        this.keyPair = ec.genKeyPair()
        this.publicKey = this.keyPair.getPublic().encode('hex')
    }

    sign(data) {
        return this.keyPair.sign(Crypto.sha256(data))
    }

    createTransaction({ recipient, amount }) {
        if(amount > this.balance) {
            throw Error('La cantidad excede el balance')
        }

        return new Transaction({ senderWallet: this, recipient, amount })
    }
}

module.exports = Wallet
