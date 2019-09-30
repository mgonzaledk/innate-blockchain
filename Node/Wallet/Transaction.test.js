const Wallet = require('./index')
const Transaction = require('./Transaction')
const { verifySignature } = require('../Util')

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

    describe('input', () => {
        it('tiene una entrada `input`', () => {
            expect(transaction).toHaveProperty('input')
        })

        it('tiene una marca de tiempo `timestamp` para la entrada', () => {
            expect(transaction.input).toHaveProperty('timestamp')
        })

        it('establece la cantidad `amount` del balance de la cartera `senderWallet`', () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance)
        })

        it('establece la dirección `address` como la clave pública de la cartera', () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey)
        })

        it('firma su contenido', () => {
            expect(verifySignature({
                publicKey: senderWallet.publicKey,
                data: transaction.outputMap,
                signature: transaction.input.signature
            })).toBe(true)
        })
    })

    describe('valid()', () => {
        let errorMock

        beforeEach(() => {
            errorMock = jest.fn()
            global.console.error = errorMock
        })

        describe('cuando la transacción es válida', () => {
            it('devuelve verdadero', () => {
                expect(Transaction.valid(transaction)).toBe(true)
            })
        })

        describe('cuando la transacción no es válida', () => {
            describe('y el mapa de salida de la transacción no es válido', () => {
                it('devuelve falso y registra un error', () => {
                    transaction.outputMap[senderWallet.publicKey] = 9999

                    expect(Transaction.valid(transaction)).toBe(false)
                    expect(errorMock).toHaveBeenCalled()
                })
            })

            describe('y la entrada de la transacción no es válida', () => {
                it('devuelve falso y registra un error', () => {
                    transaction.input.signature = new Wallet().sign('data')

                    expect(Transaction.valid(transaction)).toBe(false)
                    expect(errorMock).toHaveBeenCalled()
                })
            })
        })
    })

    describe('update()', () => {
        let originalSignature, originalSenderOutput, nextRecipient, nextAmount

        beforeEach(() => {
            originalSignature = transaction.input.signature
            originalSenderOutput = transaction.outputMap[senderWallet.publicKey]
            nextRecipient = 'next-recipient-address'
            nextAmount = 50

            transaction.update({
                senderWallet,
                recipient: nextRecipient,
                amount: nextAmount
            })
        })

        it('genera la salida al siguiente receptor', () => {
            expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount)
        })

        it('resta la cantidad del balance de la cuenta de envío', () => {
            expect(transaction.outputMap[senderWallet.publicKey])
                .toEqual(originalSenderOutput - nextAmount)
        })

        it('mantiene el valor de entrada igual a los valores de salida', () => {
            expect(Object.values(transaction.outputMap)
                .reduce((total, outputAmount) => total + outputAmount))
                .toEqual(transaction.input.amount)

        })

        it('refirma la transacción', () => {
            expect(transaction.input.signature).not.toEqual(originalSignature)
        })
    })
})
