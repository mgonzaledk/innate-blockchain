const Blockchain = require('./Blockchain')
const Block = require('./Block')

describe('Blockchain', () => {
    const blockchain = new Blockchain()

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
})
