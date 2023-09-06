const { validatePhoneNumber } = require("../apis/twilioAgent");
const { exists, hasValue } = require("../utils/helpers");

async function getCellAndAltPhones(reverseContactData, versiumContactData) {
    let numbersSentForValidation = new Set();
    let cellPhone = null;
    if (reverseContactData?.phoneNumbers?.length > 0) {
        cellPhone = await validateContactNumbers(reverseContactData.phoneNumbers, numbersSentForValidation);
    }
    if (!hasValue(cellPhone) && versiumContactData?.cellPhones?.length > 0) {
        cellPhone = await validateContactNumbers(versiumContactData.cellPhones, numbersSentForValidation);
    }

    let alternativePhone = null;
    if (versiumContactData?.landPhones?.length > 0) {
        alternativePhone = await validateContactNumbers(versiumContactData.landPhones, numbersSentForValidation);
    }
    if (!hasValue(alternativePhone) && reverseContactData?.phoneNumbers?.length > 0) {
        alternativePhone = await validateContactNumbers(reverseContactData.phoneNumbers, numbersSentForValidation);
    }
    if (!hasValue(alternativePhone) && versiumContactData?.cellPhones?.length > 0) {
        alternativePhone = await validateContactNumbers(versiumContactData.cellPhones, numbersSentForValidation);
    }

    return [cellPhone, alternativePhone];
}

async function validateContactNumbers(contactNumbers, numbersSentForValidation) {
    if (!exists(contactNumbers)) {
        console.log('There are no contact number to be validated.');
        return null;
    }

    let contactNumber = null;
    for (let i = 0; i < contactNumbers.length; i++) {
        if (numbersSentForValidation.has(contactNumbers[i])) {
            continue;
        }

        let isPhoneValid = await validatePhoneNumber(contactNumbers[i]);
        numbersSentForValidation.add(contactNumbers[i]);

        if (isPhoneValid) {
            contactNumber = contactNumbers[i];
            break;
        }
    }

    return contactNumber;
}

module.exports = {
    validateContactNumbers: validateContactNumbers,
    getCellAndAltPhones: getCellAndAltPhones,
}
