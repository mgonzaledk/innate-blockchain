const Transaction = require('./Wallet/Transaction')

class TransactionMiner {
    constructor({ blockchain, transactionPool, wallet, pubsub }) {
        this.blockchain = blockchain
        this.transactionPool = transactionPool
        this.wallet = wallet
        this.pubsub = pubsub
    }

    mine() {
        const validTransactions = this.transactionPool.valids()

        validTransactions.push(
            Transaction.reward({ minerWallet: this.wallet })
        )

        this.blockchain.add({ data: validTransactions })
        this.pubsub.broadcastChain()

        this.transactionPool.clear()
    }
}

module.exports = TransactionMiner
