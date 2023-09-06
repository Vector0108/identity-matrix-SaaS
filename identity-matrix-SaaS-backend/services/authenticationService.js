const { sendResetPassword, sendEmailVerification } = require("../apis/emailAgent");
const { UserDTO } = require("../dtos/userDTO");
const { createUser, getUser, setNewPassword, verifyUserAccount, setSentEmail } = require("../repositories/userRepository");
const constants = require("../utils/constants");
const { getPasswordHash } = require("../utils/helpers");


async function registerUser(registrationForm) {
    const passwordHash = getPasswordHash(registrationForm.password);

    const userDTO = UserDTO(registrationForm.firstName, registrationForm.lastName,
        registrationForm.email, passwordHash, registrationForm.companyName);

    await createUser(userDTO);
}

async function resetUserPassword(email) {
    const user = await getUser(email);
    if (user === null) {
        return [false, {
            httpCode: 400,
            message: constants.MESSAGE_PASSWORD_RESET_FAILED
        }];
    }

    const newPassword = await setNewPassword(user);
    const sentEmail = await sendResetPassword(email, newPassword);

    if (sentEmail === null || sentEmail?.code == constants.EMAIL_NOT_SENT_CODE) {
        return [false, {
            httpCode: 500,
            message: constants.MESSAGE_EMAIL_NOT_SENT
        }];
    }

    return newPassword;
}

async function verifyAccount(token) {
    await verifyUserAccount(token);
}

async function sendAccountVerificationEmail(user, token) {
    const sentEmail = await sendEmailVerification(user, token);
    if (sentEmail === null || sentEmail?.code == constants.EMAIL_NOT_SENT_CODE) {
        return [false, {
            httpCode: 500,
            message: constants.MESSAGE_EMAIL_NOT_SENT
        }];
    }

    await setSentEmail(user);

    return [true, null];
}

module.exports = {
    registerUser: registerUser,
    resetUserPassword: resetUserPassword,
    verifyAccount: verifyAccount,
    sendAccountVerificationEmail: sendAccountVerificationEmail,
}
