const INITIAL_DIFFICULTY = 3

const GENESIS_BLOCK = {
    timestamp: 1,
    previousHash: '0',
    hash: '0',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
}

module.exports = { GENESIS_BLOCK }
