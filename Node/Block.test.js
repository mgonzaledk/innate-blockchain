const Block = require('./Block')
const { GENESIS_BLOCK } = require('./Config')

describe('Block', () => {
    const timestamp = 'timestamp'
    const previousHash = 'previousHash'
    const hash = 'hash'
    const data = ['data', 'more_data']

    const block = new Block({ timestamp, previousHash, hash, data })

    it('contiene valores del constructor', () => {
        expect(block.timestamp).toEqual(timestamp)
        expect(block.previousHash).toEqual(previousHash)
        expect(block.hash).toEqual(hash)
        expect(block.data).toEqual(data)
    })

    describe(' - createGenesis()', () => {
        const genesisBlock = Block.createGenesis()

        it('devuelve instancia de un bloque', () => {
            expect(genesisBlock instanceof Block).toBe(true)
        })

        it('devuelve los datos del génesis', () => {
            expect(genesisBlock).toEqual(GENESIS_BLOCK)
        })
    })

    describe(' - mineBlock()', () => {
        const previousBlock = Block.createGenesis()
        const data = 'test data'

        const minedBlock = Block.mineBlock({ previousBlock, data })

        it('devuelve instancia de un bloque', () => {
            expect(minedBlock instanceof Block).toBe(true)
        })

        it('establece `previousHash` como el `hash` del bloque anterior', () => {
            expect(minedBlock.previousHash).toEqual(previousBlock.hash)
        })

        it('establece el campo `data`', () => {
            expect(minedBlock.data).toEqual(data)
        })

        it('establece una marca de tiempo', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined)
        })
    })
})
