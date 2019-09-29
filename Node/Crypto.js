const crypto = require('crypto')

class Crypto {
    static sha256(...args) {
        const hash = crypto.createHash('sha256')

        hash.update(args.sort().join(' '))

        let digest = hash.digest('hex')
        return digest
    }
}

module.exports = Crypto
