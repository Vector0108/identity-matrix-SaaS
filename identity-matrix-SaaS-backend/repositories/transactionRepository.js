const { Transaction } = require("../models/transaction");


async function getUserCreditTransactions(userId) {
    try {
        const transactions = await Transaction.find({ userId: userId })

        return transactions;
    } catch (error) {
        console.log(`An error has occurred while attempting to get transactions for userId: ${userId}. Error - [${JSON.stringify(error)}]`);
        throw new Error();
    }
}

module.exports = {
    getUserCreditTransactions: getUserCreditTransactions
}
