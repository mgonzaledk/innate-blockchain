const Blockchain = require('./index')
const Block = require('./Block')
const { Crypto } = require('../Util')

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
    })
})
