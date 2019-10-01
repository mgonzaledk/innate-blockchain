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
}

module.exports = TransactionPool
