const { getCreditTransactions } = require("../services/accountCreditService");


async function getTransactions(req, res, next) {
	try {
		const transactions = await getCreditTransactions(req.userId);

		res.status(200).send(transactions.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)))
	} catch (e) {
		next(e);
	}
};

module.exports = {
	getTransactions,
};
