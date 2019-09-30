const { STARTING_BALANCE } = require('../Config')
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
}

module.exports = Wallet
