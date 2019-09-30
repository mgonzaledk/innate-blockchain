const { ec } = require('../Util')
const { STARTING_BALANCE } = require('../Config')

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE

        const keyPair = ec.genKeyPair()
        this.publicKey = keyPair.getPublic()
    }
}

module.exports = Wallet
