const Blockchain = require('./index')
const Block = require('./Block')
const { Crypto } = require('../Util')
const Transaction = require('../Wallet/Transaction')
const Wallet = require('../Wallet')

describe('Blockchain', () => {
    let blockchain

    beforeEach(() => {
        blockchain = new Blockchain()
    })

    it('la cadena `chain` es instancia de un Array', () => {
        expect(blockchain.chain instanceof Array).toBe(true)
    })

    it('la cadena `chain` inicia con el bloque de génesis', () => {
        expect(blockchain.chain[0]).toEqual(Block.createGenesis())
    })

    it('añadir un nuevo bloque a la cadena', () => {
        const data = 'test-data'

        blockchain.add({ data })

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data)
    })

    describe('isValid()', () => {
        describe('cuando la cadena de bloques no inicia con el bloque de génesis', () => {
            it('devuelve falso', () => {
                blockchain.chain[0] = { data: 'fake' }

                expect(Blockchain.isValid(blockchain.chain)).toBe(false)
            })
        })

        describe('cuando la cadena de bloques inicia con el bloque de génesis y tiene múltiples bloques', () => {
            beforeEach(() => {
                blockchain.add({ data: '1' })
                blockchain.add({ data: '2' })
                blockchain.add({ data: '3' })
            })

            describe('y una referencia `previousHash` ha cambiado', () => {
                it('devuelve falso', () => {
                    blockchain.chain[2].previousHash = 'fake-hash'

                    expect(Blockchain.isValid(blockchain.chain)).toBe(false)
                })
            })

            describe('y contiene un bloque con un campo inválido', () => {
                it('devuelve falso', () => {
                    blockchain.chain[2].data = 'bad-evil'

                    expect(Blockchain.isValid(blockchain.chain)).toBe(false)
                })
            })

            describe('y contiene un bloque con una dificultad salteada', () => {
                it('devuelve falso', () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length - 1]

                    const timestamp = Date.now()
                    const lastHash = lastBlock.hash
                    const difficulty = lastBlock.difficulty - 3
                    const nonce = 0
                    const data = []
                    const hash = Crypto.sha256(timestamp, lastHash, difficulty, nonce, data)

                    const evilBlock = new Block({
                        timestamp, lastHash, hash, difficulty, nonce, data
                    })

                    blockchain.chain.push(evilBlock)
                    expect(Blockchain.isValid(blockchain.chain)).toBe(false)
                })
            })

            describe('y no contiene ningún bloque inválido', () => {
                it('devuelve verdadero', () => {
                    expect(Blockchain.isValid(blockchain.chain)).toBe(true)
                })
            })
        })
    })

    describe('replace()', () => {
        let newChain, originalChain
        let errorMock, logMock

        beforeEach(() => {
            newChain = new Blockchain()
            originalChain = blockchain.chain

            errorMock = jest.fn()
            logMock = jest.fn()

            global.console.error = errorMock
            global.console.log = logMock
        })

        describe('cuando la nueva cadena no es mayor', () => {
            it('no reemplaza la cadena', () => {
                newChain.chain[0] = { new: 'chain' }

                blockchain.replace(newChain.chain)

                expect(blockchain.chain).toEqual(originalChain)
            })
        })

        describe('cuando la nueva cadena es mayor', () => {
            beforeEach(() => {
                newChain.add({ data: '1' })
                newChain.add({ data: '2' })
                newChain.add({ data: '3' })
            })

            describe('y la cadena es inválida', () => {
                it('no reemplaza la cadena', () => {
                    newChain.chain[2].hash = 'fake'

                    blockchain.replace(newChain.chain)

                    expect(blockchain.chain).toEqual(originalChain)
                })
            })

            describe('y la cadena es válida', () => {
                it('reemplaza la cadena', () => {
                    blockchain.replace(newChain.chain)

                    expect(blockchain.chain).toEqual(newChain.chain)
                })
            })
        })

        describe('y la bandera `validateTransactions` es `true`', () => {
            it('llama a validTransactionData()', () => {
                const validTransactionDataMock = jest.fn()

                blockchain.validTransactionData = validTransactionDataMock
                newChain.add({ data: 'test' })
                blockchain.replace(newChain.chain, true)

                expect(validTransactionDataMock).toHaveBeenCalled()
            })
        })
    })

    describe('validTransactionData()', () => {
        let transaction, rewardTransaction, wallet
        let newChain

        beforeEach(() => {
            newChain = new Blockchain()
            wallet = new Wallet()
            transaction = wallet.createTransaction({
                recipient: 'to-address',
                amount: 65
            })
            rewardTransaction = Transaction.reward({ minerWallet: wallet })
        })

        describe('y los datos de transacción son válidos', () => {
            it('devuelve verdadero', () => {
                newChain.add({ data: [transaction, rewardTransaction] })

                expect(blockchain.validTransactionData({
                    chain: newChain.chain
                })).toBe(true)
            })
        })

        describe('y la transacción tiene múltiples recompensas', () => {
            it('devuelve falso', () => {
                newChain.add({
                    data: [transaction, rewardTransaction, rewardTransaction]
                })

                expect(blockchain.validTransactionData({
                    chain: newChain.chain
                })).toBe(false)
            })
        })

        describe('y la transacción tiene al menos un mapa de salida mal formado', () => {
            describe('y la transacción no es de recompensa', () => {
                it('devuelve falso', () => {
                    transaction.outputMap[wallet.publicKey] = 9999
                    newChain.add({ data: [transaction, rewardTransaction] })

                    expect(blockchain.validTransactionData({
                        chain: newChain.chain
                    })).toBe(false)
                })
            })

            describe('y la transacción es de recompensa', () => {
                it('devuelve falso', () => {
                    rewardTransaction.outputMap[wallet.publicKey] = 9999
                    newChain.add({ data: [transaction, rewardTransaction] })

                    expect(blockchain.validTransactionData({
                        chain: newChain.chain
                    })).toBe(false)
                })
            })
        })

        describe('y la transacción tiene al menos una entrada mal formada', () => {
            it('devuelve falso', () => {
                wallet.balance = 9000

                const evilOutputMap = {
                    [wallet.publicKey]: 8900,
                    toAddress: 100
                }

                const evilTransaction = {
                    input: {
                        timestamp: Date.now(),
                        amount: wallet.balance,
                        address: wallet.publicKey,
                        signature: wallet.sign(evilOutputMap)
                    },
                    outputMap: evilOutputMap
                }

                newChain.add({ data: [evilTransaction, rewardTransaction] })

                expect(blockchain.validTransactionData({
                    chain: newChain.chain
                })).toBe(false)
            })
        })

        describe('y un bloque contiene múltiples transacciones idénticas', () => {
            it('devuelve falso', () => {
                newChain.add({
                    data: [transaction, transaction, rewardTransaction]
                })

                expect(blockchain.validTransactionData({
                    chain: newChain.chain
                })).toBe(false)
            })
        })
    })
})
