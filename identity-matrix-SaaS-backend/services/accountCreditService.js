const { getUserCreditTransactions } = require("../repositories/transactionRepository");


async function getCreditTransactions(userId) {
    const transactions = await getUserCreditTransactions(userId);
    // TODO: transform transactions to DTO objects

    return transactions;
}

module.exports = {
    getCreditTransactions: getCreditTransactions
}
