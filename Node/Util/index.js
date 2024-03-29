const EC = require('elliptic').ec
const ec = new EC('secp256k1')

const Crypto = require('./Crypto')

const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex')
    return keyFromPublic.verify(Crypto.sha256(data), signature)
}

module.exports = { ec, verifySignature, Crypto }
