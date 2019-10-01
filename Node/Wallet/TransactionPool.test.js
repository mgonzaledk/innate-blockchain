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

    describe('valids()', () => {
        let validTransactions, errorMock

        beforeEach(() => {
            validTransactions = []
            errorMock = jest.fn()

            global.console.error = errorMock

            for(let i = 0; i < 10; ++i) {
                transaction = new Transaction({
                    senderWallet,
                    recipient: 'to-address',
                    amount: 30
                })

                if(i % 3 === 0) {
                    transaction.input.amount = 9999
                } else if(i % 3 === 1) {
                    transaction.input.signature = new Wallet().sign('foo')
                } else {
                    validTransactions.push(transaction)
                }

                transactionPool.add(transaction)
            }
        })

        it('devuelve las transacciones válidas', () => {
            expect(transactionPool.valids()).toEqual(validTransactions)
        })

        it('registrar errores para las transacciones inválidas', () => {
            transactionPool.valids()
            expect(errorMock).toHaveBeenCalled()
        })
    })
})
