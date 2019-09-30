const Wallet = require('./index')
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
})
