const createError = require('../utils/createError');
const { authenticateUser, getUserFromJwt } = require('../helpers/authenticationHelper');
const { hasValue } = require('../utils/helpers');
const { sendRegistrationMessage } = require('../apis/emailAgent');
const { validateNewUserCredentials } = require('../helpers/authenticationHelper');
const { registerUser, resetUserPassword, sendAccountVerificationEmail } = require('../services/authenticationService');
const constants = require('../utils/constants');
const { validateRegistrationForm, validateLoginForm } = require('../helpers/requestValidator');


async function register(req, res, next) {
	const [isFormValid, registrationForm] = validateRegistrationForm(req.body);
	if (!isFormValid) {
		return next(createError(400, constants.MESSAGE_CREDENTIALS_NOT_PROVIDED));
	}

	const userErrorObject = await validateNewUserCredentials(registrationForm.email, registrationForm.password);
	
	if (userErrorObject !== null) {
		return next(createError(userErrorObject.httpCode, userErrorObject.message));
	}

	try {
		await registerUser(registrationForm);
		await sendRegistrationMessage({email:req.body.email})
		res.status(201).send('User successfully created');
	} catch (e) {
		next(e);
	}
};

async function login(req, res, next) {
	const [isFormValid, loginForm] = validateLoginForm(req.body);
	
	if (!isFormValid) {
        return next(createError(400, 'Please input your credentials'));
    }

	const [user, jwtToken, errorObject] = await authenticateUser(loginForm.email, loginForm.password);
	if (errorObject !== null) {
		return next(createError(errorObject.httpCode, errorObject.message));
	}

	try {
		if(user.firstLogin) {
			const [isEmailSent, errorObject] = await sendAccountVerificationEmail(user, jwtToken);
		}

		const { password, ...info } = user._doc;
		res.status(200).send({ ...info, token: jwtToken });
	} catch (e) {
		next(e);
	}
};

async function logout(req, res, next) {
	try {
		return res.status(200).send(constants.MESSAGE_LOGOUT);
	} catch (e) {
		next(e);
	}
};

async function requestPasswordReset(req, res, next) {
	const email = req.body.email;
	if (!hasValue(email)) {
		return next(createError(400, constants.MESSAGE_CREDENTIALS_NOT_PROVIDED));
	}

	try {
		const newPassword = await resetUserPassword(email);

		res.status(200).send(newPassword);
	} catch (e) {
		next(e);
	}
};

async function verifyEmail(req, res, next) {
	const { token } = req.params;
	const [payloadId, errorObject] = verifyJwtToken(token);
	
	if (errorObject)
		return res.status(errorObject.httpCode).send(errorObject.message);

	try {
		await verifyAccount(payloadId);
		res.status(200).send(constants.MESSAGE_ACCOUNT_ACTIVATED);
	} catch (error) {
		res.status(500).send(constants.MESSAGE_ACCOUNT_NOT_ACTIVATED);
	}
}

async function resendValidationEmail(req, res, next) {
	try {
		let user = await getUserFromJwt(req.userId);

		const [isEmailSent, errorObject] = await sendAccountVerificationEmail(user, token);
		if (errorObject) {
			res.status(errorObject.httpCode).send(errorObject.message);
		}

		res.status(200).send(constants.MESSAGE_VALIDATION_EMAIL_SENT)
	} catch (err) {
		next(err)
	}
}

module.exports = {
	register,
	login,
	logout,
	requestPasswordReset,
	verifyEmail,
	resendValidationEmail
};
