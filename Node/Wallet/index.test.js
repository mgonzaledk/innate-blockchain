const Blockchain = require('../Blockchain')
const { STARTING_BALANCE } = require('../Config')
const Wallet = require('./index')
const Transaction = require('./Transaction')
const { verifySignature } = require('../Util')

describe('Wallet', () => {
    let wallet

    beforeEach(() => {
        wallet = new Wallet()
    })

    it('tiene un `balance`', () => {
        expect(wallet).toHaveProperty('balance')
    })

    it('tiene una clave pública `publicKey`', () => {
        expect(wallet).toHaveProperty('publicKey')
    })

    describe('firmando datos', () => {
        const data = 'test-data'

        it('verifica la firma', () => {
            expect(verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: wallet.sign(data)
            })).toBe(true)
        })

        it('no verifica una firma inválida', () => {
            expect(verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: new Wallet().sign(data)
            })).toBe(false)
        })
    })

    describe('createTransaction()', () => {
        describe('y la cantidad excede el balance de la cartera', () => {
            it('provoca un error', () => {
                expect(() => wallet.createTransaction({ amount: 9999, recipient: 'test-recipient' }))
                    .toThrow('La cantidad excede el balance')
            })
        })

        describe('y la cantidad es válida', () => {
            let transaction, amount, recipient

            beforeEach(() => {
                amount = 50
                recipient = 'test-recipient'
                transaction = wallet.createTransaction({ amount, recipient })
            })

            it('crea una instancia de `Transaction`', () => {
                expect(transaction instanceof Transaction).toBe(true)
            })

            it('coincide la entrada de la transacción con el balance total', () => {
                expect(transaction.input.address).toEqual(wallet.publicKey)
            })

            it('genera la salida en el receptor', () => {
                expect(transaction.outputMap[recipient]).toEqual(amount)
            })
        })

        describe('y se pasa el parámetro cadena', () => {
            it('llama a `Wallet.balance`', () => {
                const balanceMock = jest.fn()
                const originalBalance = Wallet.balance

                Wallet.balance = balanceMock

                wallet.createTransaction({
                    recipient: 'to-address',
                    amount: 100,
                    chain: new Blockchain().chain
                })

                expect(balanceMock).toHaveBeenCalled()
                Wallet.balance = originalBalance
            })
        })
    })

    describe('balance()', () => {
        let blockchain

        beforeEach(() => {
            blockchain = new Blockchain()
        })

        describe('no existen salidas para la cartera', () => {
            it('devuelve el balance inicial `STARTING_BALANCE`', () => {
                expect(Wallet.balance({
                    chain: blockchain.chain,
                    address: wallet.publicKey
                })).toEqual(STARTING_BALANCE)
            })
        })

        describe('existen salidas para la cartera', () => {
            let transactionA, transactionB

            beforeEach(() => {
                transactionA = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 50
                })

                transactionB = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 60
                })

                blockchain.add({ data: [transactionA, transactionB] })
            })

            it('añade la suma de las salidas al balance de la cartera', () => {
                expect(Wallet.balance({
                    chain: blockchain.chain,
                    address: wallet.publicKey
                })).toEqual(
                    STARTING_BALANCE +
                    transactionA.outputMap[wallet.publicKey] +
                    transactionB.outputMap[wallet.publicKey]
                )
            })

            describe('y la cartera ha hecho una transacción', () => {
                let recentTransaction

                beforeEach(() => {
                    recentTransaction = wallet.createTransaction({
                        recipient: 'to-address',
                        amount: 30
                    })

                    blockchain.add({ data: [recentTransaction] })
                })

                it('devuelve la cantidad de salida de la transacción', () => {
                    expect(Wallet.balance({
                        chain: blockchain.chain,
                        address: wallet.publicKey
                    })).toEqual(recentTransaction.outputMap[wallet.publicKey])
                })

                describe('y hay salidas contiguas después de la transacción', () => {
                    let sameBlockTransaction, nextBlockTransaction

                    beforeEach(() => {
                        recentTransaction = wallet.createTransaction({
                            recipient: 'to-to-address',
                            amount: 60
                        })

                        sameBlockTransaction = Transaction.reward({ minerWallet: wallet })
                        blockchain.add({ data: [recentTransaction, sameBlockTransaction] })

                        nextBlockTransaction = new Wallet().createTransaction({
                            recipient: wallet.publicKey,
                            amount: 80
                        })

                        blockchain.add({ data: [nextBlockTransaction] })
                    })

                    it('incluye la salida en el balance devuelto', () => {
                        expect(Wallet.balance({
                            chain: blockchain.chain,
                            address: wallet.publicKey
                        })).toEqual(
                            recentTransaction.outputMap[wallet.publicKey] +
                            sameBlockTransaction.outputMap[wallet.publicKey] +
                            nextBlockTransaction.outputMap[wallet.publicKey]
                        )
                    })
                })
            })
        })
    })
})
