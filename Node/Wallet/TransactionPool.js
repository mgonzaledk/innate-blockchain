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
}

module.exports = TransactionPool
