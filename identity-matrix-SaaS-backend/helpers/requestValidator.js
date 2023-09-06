const { hasValue, getPasswordHash } = require("../utils/helpers");

function validateRegistrationForm(requestBody) {
    const firstName = requestBody.first;
    const lastName = requestBody.last;
    const email = requestBody.email;
    const password = requestBody.password;
    const companyName = requestBody.company;

    if (!hasValue(firstName) || !hasValue(lastName)
       || !hasValue(email) || !hasValue(password) || !hasValue(companyName)) {
        return [false, null];
    }

    return [true, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        companyName: companyName
    }];
}

function validateLoginForm(requestBody) {
    const email = requestBody.email;
	const password = requestBody.password;

    if (!hasValue(email) || !hasValue(password)) {
        return [false, null];
    }

    // const passwordHash = getPasswordHash(password);
    return [true, {
        email: email,
        password: password
    }];
}

module.exports = {
    validateRegistrationForm: validateRegistrationForm,
    validateLoginForm: validateLoginForm
}
