const bodyParser = require('body-parser')
const express = require('express')

const Blockchain = require('./Blockchain')
const { PORT } = require('./Config')

const app = express()
const blockchain = new Blockchain()

app.use(bodyParser.json())

app.get('/v1/blocks', (req, res) => {
    res.json(blockchain.chain)
})

app.post('/v1/mine', (req, res) => {
    const { data } = req.body

    blockchain.add({ data })

    res.redirect('/v1/blocks')
})

app.listen(3000, () => console.info(`Escuchando en localhost:${PORT}`))
