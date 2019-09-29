const Blockchain = require('./Blockchain')
const Block = require('./Block')

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

            describe('y no contiene ningún bloque inválido', () => {
                it('devuelve verdadero', () => {
                    expect(Blockchain.isValid(blockchain.chain)).toBe(true)
                })
            })
        })
    })
})
