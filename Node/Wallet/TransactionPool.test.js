const Wallet = require('./index')
const Transaction = require('./Transaction')
const TransactionPool = require('./TransactionPool')

describe('TransactionPool', () => {
    let transactionPool, transaction

    beforeEach(() => {
        transactionPool = new TransactionPool()
        transaction = new Transaction({
            senderWallet: new Wallet(),
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
})
