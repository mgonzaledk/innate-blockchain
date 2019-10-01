const Wallet = require('./index')
const Transaction = require('./Transaction')
const TransactionPool = require('./TransactionPool')

describe('TransactionPool', () => {
    let transactionPool, transaction, senderWallet

    beforeEach(() => {
        senderWallet = new Wallet()
        transactionPool = new TransactionPool()
        transaction = new Transaction({
            senderWallet,
            recipient: 'to-address',
            amount: 50
        })
    })

    describe('add()', () => {
        it('añade una transacción', () => {
            transactionPool.add(transaction)

            expect(transactionPool.transactionMap[transaction.id])
                .toBe(transaction)
        })
    })

    describe('exists()', () => {
        it('devuelve una transacción existente por su dirección de entrada', () => {
            transactionPool.add(transaction)

            expect(transactionPool.exists({ inputAddress: senderWallet.publicKey }))
                .toBe(transaction)
        })
    })
})
