const redis = require('redis')

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
}

class PubSub {
    constructor({ blockchain, transactionPool }) {
        this.blockchain = blockchain
        this.transactionPool = transactionPool

        this.publisher = redis.createClient()
        this.subscriber = redis.createClient()

        this.subscribeToChannels()
        this.subscriber.on('message', (channel, message) =>
            this.handleMessage(channel, message))
    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel)
        })
    }

    handleMessage(channel, message) {
        console.log(`Mensaje recibido. Canal: ${channel}. Mensaje: ${message}.`)

        const parsedMessage = JSON.parse(message)

        switch(channel) {
            case CHANNELS.BLOCKCHAIN: this.blockchain.replace(parsedMessage); break
            case CHANNELS.TRANSACTION: this.transactionPool.add(parsedMessage); break
        }
    }

    publish({ channel, message }) {
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel)
            })
        })
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        })
    }
}

module.exports = PubSub
