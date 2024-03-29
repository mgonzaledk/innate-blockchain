const PORT = 3000
const ROOT_NODE_ADDRESS = `http://localhost:${PORT}`

const MINING_RATE = 1000
const INITIAL_DIFFICULTY = 3

const GENESIS_BLOCK = {
    timestamp: 1,
    previousHash: '0',
    hash: '0',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
}

const STARTING_BALANCE = 1000

const REWARD_INPUT = { address: '***INNATE-REWARD-ADDRESS***' }
const MINING_REWARD = 50

module.exports = {
    PORT,
    MINING_RATE,
    GENESIS_BLOCK,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD
}
