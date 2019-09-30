const Blockchain = require('../Blockchain')

const blockchain = new Blockchain()
blockchain.add({ data: 'initial' })

let previousTimestamp, nextTimestamp, nextBlock, timeDifference, average
const times = []

for(let i = 0; i < 10000; ++i) {
    previousTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp
    blockchain.add({ data: `block${i}` })

    nextBlock = blockchain.chain[blockchain.chain.length - 1]
    nextTimestamp = nextBlock.timestamp

    timeDifference = nextTimestamp - previousTimestamp
    times.push(timeDifference)

    average = times.reduce((total, num) => (total + num)) / times.length

    console.log(`Tiempo para minar el bloque: ${timeDifference}ms. Dificultad: ${nextBlock.difficulty}. Tiempo medio: ${average}ms`)
}
