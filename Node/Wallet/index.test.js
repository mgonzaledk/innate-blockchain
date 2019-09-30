const Wallet = require('./index')

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
})
