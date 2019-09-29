const hexToBinary = require('hex-to-binary')

const Block = require('./Block')
const { GENESIS_BLOCK, MINING_RATE } = require('./Config')
const Crypto = require('./Crypto')

describe('Block', () => {
    const timestamp = 2000
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
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty))
        })

        it('ajusta la dificultad', () => {
            const pairResult = [ previousBlock.difficulty + 1, previousBlock.difficulty - 1 ]

            expect(pairResult.includes(minedBlock.difficulty)).toBe(true)
        })
    })

    describe('adjustDifficulty()', () => {
        it('elevar dificultad si se realiza un minado excesivo', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINING_RATE - 100
            })).toEqual(block.difficulty + 1)
        })

        it('disminuir dificultad si se realiza un minado escaso', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINING_RATE + 100
            })).toEqual(block.difficulty - 1)
        })

        it('dificultad mínima de 1', () => {
            block.difficulty = -1

            expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1)
        })
    })
})
