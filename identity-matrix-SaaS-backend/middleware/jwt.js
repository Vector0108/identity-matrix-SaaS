const constants = require('../utils/constants');
const createError = require('../utils/createError');
const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next) {
	const token = req.headers['authorization']?.split(' ')[1];
	if (!token) return next(createError(401, constants.MESSAGE_NOT_AUTHENTICATED));

	const [payloadId, errorObject] = verifyJwtToken(token);

	if (errorObject) {
		return next(createError(errorObject.httpCode, errorObject.message));
	}

	req.userId = payloadId;
	next();
};

function verifyJwtToken(token) {
	return jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
		if (err) return [null, {httpCode: 401, message: constants.MESSAGE_NOT_AUTHENTICATED}];
		if (payload && Date.now() > payload?.exp * 1000) return [null, {httpCode: 401, message: constants.MESSAGE_NOT_AUTHENTICATED}];
		return [payload.id, null];
	});
}


module.exports = {
	verifyJwtToken: verifyJwtToken,
	verifyToken: verifyToken
};
