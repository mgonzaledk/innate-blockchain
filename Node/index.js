const bodyParser = require('body-parser')
const express = require('express')
const request = require('request')

const Blockchain = require('./Blockchain')
const { PORT, ROOT_NODE_ADDRESS } = require('./Config')
const PubSub = require('./Server/PubSub')
const TransactionMiner = require('./TransactionMiner')
const TransactionPool = require('./Wallet/TransactionPool')
const Wallet = require('./Wallet')

const app = express()
const blockchain = new Blockchain()
const transactionPool = new TransactionPool()
const pubsub = new PubSub({ blockchain, transactionPool })
const wallet = new Wallet()
const transactionMiner = new TransactionMiner({
    blockchain,
    transactionPool,
    wallet,
    pubsub
})

app.use(bodyParser.json())

app.get('/v1/blocks', (req, res) => {
    res.json(blockchain.chain)
})

app.post('/v1/mine', (req, res) => {
    const { data } = req.body

    blockchain.add({ data })
    pubsub.broadcastChain()

    res.redirect('/v1/blocks')
})

app.post('/v1/transaction', (req, res) => {
    const { amount, recipient } = req.body
    let transaction = transactionPool.exists({
        inputAddress: wallet.publicKey
    })

    try {
        if(transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount })
        } else {
            transaction = wallet.createTransaction({
                amount,
                recipient,
                chain: blockchain.chain
            })
        }
    } catch(error) {
        return res.status(400).json({ type: 'error', message: error.message })
    }

    transactionPool.add(transaction)
    pubsub.broadcastTransaction(transaction)

    res.json({ type: 'success', transaction })
})

app.get('/v1/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap)
})

app.get('/v1/mine-transactions', (req, res) => {
    transactionMiner.mine()

    res.redirect('/api/blocks')
})

app.get('/v1/wallet-info', (req, res) => {
    const address = wallet.publicKey

    res.json({
        address,
        balance: Wallet.balance({
            chain: blockchain.chain,
            address
        })
    })
})

const syncWithRootState = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/v1/blocks` }, (error, response, body) => {
        if(!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body)
            blockchain.replace(rootChain)
        }
    })

    request({ url: `${ROOT_NODE_ADDRESS}/v1/transaction-pool-map` }, (error, response, body) => {
        if(!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body)
            transactionPool.replace(rootTransactionPoolMap)
        }
    })
}

let port = PORT

if(process.env.GENERATE_PEER_PORT === 'true') {
    port = PORT + Math.ceil(Math.random() * 1000)
}

app.listen(port, () => {
    console.info(`Escuchando en localhost:${port}`)

    if(port !== PORT) {
        syncWithRootState()
    }
})
