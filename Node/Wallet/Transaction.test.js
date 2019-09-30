const Wallet = require('./index')
const Transaction = require('./Transaction')

describe('Transaction', () => {
    let transaction, senderWallet, recipient, amount

    beforeEach(() => {
        senderWallet = new Wallet()
        recipient = 'recipient-public-key'
        amount = 50

        transaction = new Transaction({
            senderWallet,
            recipient,
            amount
        })
    })

    it('tiene un identificador `id`', () => {
        expect(transaction).toHaveProperty('id')
    })

    describe('outputMap', () => {
        it('tiene un mapa de salida `outputMap`', () => {
            expect(transaction).toHaveProperty('outputMap')
        })

        it('genera la salida al receptor', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount)
        })

        it('genera la salida restante (balance) de vuelta a la cartera de envío `senderWaller`', () => {
            expect(transaction.outputMap[senderWallet.publicKey])
                .toEqual(senderWallet.balance - amount)
        })
    })
})
