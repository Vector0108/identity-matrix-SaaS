const { validateEmail } = require("../apis/debounceAgent");
const { hasValue, exists } = require("../utils/helpers");
const { validateContactNumbers } = require("./phoneNumberValidator");


async function validateVersiumContactData(versiumContactData) {
    if (!exists(versiumContactData)) {
        console.log('No versium contact data is present. Nothing to validate.');
        return null;
    }

    let isAltPhoneLandline = false;
    const validatedNumbers = new Set();
    const validCellPhone = await validateContactNumbers(versiumContactData.cellPhones, validatedNumbers);
    let validLandPhone = await validateContactNumbers(versiumContactData.landPhones, validatedNumbers);
    if (hasValue(validLandPhone)) {
        isAltPhoneLandline = true;
    } else {
        validLandPhone = await validateContactNumbers(versiumContactData.cellPhones, validatedNumbers);
    }

    let validPersonalEmail = null;
    const isPersonalEmailValid = await validateEmail(versiumContactData.email);
    if (isPersonalEmailValid) {
        validPersonalEmail = versiumContactData.email;
    }

    const validatedVersiumContactData = {
        firstName: versiumContactData.firstName,
        lastName: versiumContactData.lastName,
        cellPhone: validCellPhone,
        altPhone: validLandPhone,
        isAltPhoneLandline: isAltPhoneLandline,
        personalEmail: validPersonalEmail
    }

    return validatedVersiumContactData;
}

async function validateVersiumEmails(versiumContactData, versiumAddressAndEmail) {
    let validPersonalEmail = null;

    let isFirstEmailValid = await validateEmail(versiumContactData?.email);
    if (!isFirstEmailValid) {
        if (hasValue(versiumContactData?.email)){
            versiumContactData.email = null;    // remove email received from versium if determined as invalid
        }
        if (versiumAddressAndEmail?.email !== versiumContactData?.email) {   // validate second email if different from first
            let isSecondEmailValid = await validateEmail(versiumAddressAndEmail.email);
            if (!isSecondEmailValid) {
                versiumAddressAndEmail.email = null;    // remove email received from versium if determined as invalid
            } else {
                validPersonalEmail = versiumAddressAndEmail.email;
            }
        }
    } else {
        validPersonalEmail = versiumContactData.email;
    }

    return validPersonalEmail;
}

module.exports = {
    validateVersiumContactData: validateVersiumContactData,
    validateVersiumEmails: validateVersiumEmails
}
