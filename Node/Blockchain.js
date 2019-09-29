const Block = require('./Block')

class Blockchain {
    constructor() {
        this.chain = [ Block.createGenesis() ]
    }

    add({ data }) {
        const block = Block.mineBlock({
            previousBlock: this.chain[this.chain.length - 1],
            data
        })

        this.chain.push(block)
    }
}

module.exports = Blockchain
