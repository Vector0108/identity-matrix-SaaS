const { getLeadLists } = require("../services/data.service");


async function getLists(req, res, next) {
	try {
		const leadLists = await getLeadLists(req.userId);

		res.status(200).send(leadLists.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
	} catch (e) {
		next(e);
	}
};

module.exports = {
	getLists: getLists,
};
