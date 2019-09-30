const Crypto = require('./Crypto')

describe('Crypto', () => {
    describe('sha256()', () => {
        const testString = 'innate-blockchain'
        const testHash = 'af6fe9735021444779302ce4bf3875555265a0c642f4e19fa7f3c2aa7a7186c8'

        it('genera una salida hash válida', () => {
            expect(Crypto.sha256(testString)).toEqual(testHash)
        })

        it('produce el mismo hash con la misma entrada de argumentos en cualquier orden', () => {
            expect(Crypto.sha256('1', '2', '3')).toEqual(Crypto.sha256('2', '3', '1'))
        })
    })
})

