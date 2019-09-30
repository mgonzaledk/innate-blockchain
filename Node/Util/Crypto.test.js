const Crypto = require('./Crypto')

describe('Crypto', () => {
    describe('sha256()', () => {
        const testString = 'innate-blockchain'
        const testHash = '2723d0157ce3cfe3435999f1550fbed5090933345746193dbdbe1069b940b97a'

        it('genera una salida hash válida', () => {
            expect(Crypto.sha256(testString)).toEqual(testHash)
        })

        it('produce el mismo hash con la misma entrada de argumentos en cualquier orden', () => {
            expect(Crypto.sha256('1', '2', '3')).toEqual(Crypto.sha256('2', '3', '1'))
        })

        it('produce un único hash cuando cambian las propiedades de una entrada', () => {
            const test = {}
            const originalHash = Crypto.sha256(test)

            test['test'] = 'test'

            expect(Crypto.sha256(test)).not.toEqual(originalHash)
        })
    })
})

