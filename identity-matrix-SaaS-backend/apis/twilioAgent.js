const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// NOTE: What is the format of the number we are trying to validate?
async function validatePhoneNumber(phoneNumber) {    
    if (phoneNumber === null || phoneNumber === undefined || phoneNumber.trim() === '') {
        return false;
    }

    let phoneNumberToValidate = phoneNumber.trim();
    try {
        const response = await client.lookups.v2.phoneNumbers(phoneNumberToValidate).fetch();

        const isValid = handleTwilioResponse(response);
        return isValid;
    } catch (err) {
        console.log(`Error occurred while attempting to validate phone number ${phoneNumberToValidate} with Twilio. Error - ${err}`);
        return true;    // NOTE: as agreed with Stephen, if we do not get a valid response we are storing the phone number
    }
}

// NOTE: Developed for MVP. see for more accurate error handling: https://www.twilio.com/docs/usage/requests-to-twilio
function handleTwilioResponse(response) {
    if (response.status === 200) {
        console.log(`Phone number ${response.phone_number} is valid:${response.valid}`);
        return response.valid;
    } else {
        console.log(`HTTP Response code ${response.status} received from Twilio`);
        return true;    // NOTE: as agreed with Stephen, if we do not get phone validity we are storing the phone number
    }
}

module.exports = { validatePhoneNumber : validatePhoneNumber };
