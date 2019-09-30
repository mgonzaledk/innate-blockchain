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
    })
})
