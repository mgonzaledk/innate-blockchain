const Block = require('./Block')
const { GENESIS_BLOCK } = require('./Config')
const Crypto = require('./Crypto')

describe('Block', () => {
    const timestamp = 'timestamp'
    const previousHash = 'previousHash'
    const hash = 'hash'
    const difficulty = 1
    const nonce = 1
    const data = ['data', 'more_data']

    const block = new Block({
        timestamp,
        previousHash,
        hash,
        difficulty,
        nonce,
        data
    })

    it('contiene valores del constructor', () => {
        expect(block.timestamp).toEqual(timestamp)
        expect(block.previousHash).toEqual(previousHash)
        expect(block.hash).toEqual(hash)
        expect(block.difficulty).toEqual(difficulty)
        expect(block.nonce).toEqual(nonce)
        expect(block.data).toEqual(data)
    })

    describe('createGenesis()', () => {
        const genesisBlock = Block.createGenesis()

        it('devuelve instancia de un bloque', () => {
            expect(genesisBlock instanceof Block).toBe(true)
        })

        it('devuelve los datos del génesis', () => {
            expect(genesisBlock).toEqual(GENESIS_BLOCK)
        })
    })

    describe('mineBlock()', () => {
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

        it('establece el campo `hash` con SHA256', () => {
            expect(minedBlock.hash).toEqual(Crypto.sha256(
                minedBlock.timestamp,
                previousBlock.hash,
                minedBlock.difficulty,
                minedBlock.nonce,
                data
            ))
        })

        it('establece un `hash` que coincide con el criterio de dificultad', () => {
            expect(minedBlock.hash.substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty))
        })
    })
})
