const Transaction = require('./Transaction')

class TransactionPool {
    constructor() {
        this.transactionMap = {}
    }

    add(transaction) {
        this.transactionMap[transaction.id] = transaction
    }

    exists({ inputAddress }) {
        const transactions = Object.values(this.transactionMap)

        return transactions.find(transaction =>
            transaction.input.address === inputAddress)
    }

    replace(transactionMap) {
        this.transactionMap = transactionMap
    }

    valids() {
        return Object.values(this.transactionMap).filter(transaction =>
            Transaction.valid(transaction))
    }

    clear() {
        this.transactionMap = {}
    }

    clearBlockchainTransactions({ chain }) {
        for(let i = 1; i < chain.length; ++i) {
            const block = chain[i]

            for(let transaction of block.data) {
                if(this.transactionMap[transaction.id]) {
                    delete this.transactionMap[transaction.id]
                }
            }
        }
    }
}

module.exports = TransactionPool
