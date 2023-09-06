// module through which the service communicates with debounce API
const fetch = require('node-fetch');
const CONSTANTS = require("../utils/constants");
const constants = require('../utils/constants');
const { hasValue } = require('../utils/helpers');
require('dotenv').config();

async function validateEmail(email) {
    if (!hasValue(email)) {
        console.log('No email has been passed to be validated with DeBounce.');
        return false;
    }

    const queryString = {
        api: process.env.DEBOUNCE_PUBLIC_KEY,
        email: email
    };
    const params = new URLSearchParams(queryString).toString();
    const url = `${CONSTANTS.DEBOUNCE_BASE_URL}?${params}`;
    const options = {method: 'GET', headers: {accept: 'application/json'}};
    
    let response;
    try {
        response = await fetch(url, options);
    } catch (error) {
        console.log(`An error has occurred while attempting to reach Debounce: ${JSON.stringify(error)}`);
        return true;
    }
    
    const responseContent = await handleDeBounceResponse(response);
    if (responseContent === null || responseContent.errorResponseReceived === true) {
        return true;
    }

    const isEmailValid = !(responseContent.debounce?.result === constants.FLAG_DEBOUNCE_INVALID_EMAIL);
    return isEmailValid;
}

async function handleDeBounceResponse(response) {
    let data;
    try {
        data = await response.json();
    } catch (error) {
        console.log(`An error has ocurred while trying to extract response from DeBounce. Error - [${JSON.stringify(error)}]`);
        return null;
    }
    
    // if an error has occurred during enrichment success flag is set to 0, otherwise 1
    if (data.success === 1) {
        return data;
    } else {
        let errorMessage;
        switch (response.status) {
            case 401:
                errorMessage = 'The client is unauthenticated and can not perform an action on Debounce.';
                break;
            case 402:
                errorMessage = 'Payment is required to perform an action on Debounce.';
                break;
            case 403:
                errorMessage = 'Request was unauthorized to perform an action on Debounce.';
                break;
            case 429:
                errorMessage = 'Debounce request cap has been reached. Action can not be performed.';
                break;
            default:
                errorMessage = 'An unknown error has occurred on Debounce.';
                break;
        }

        console.log(`${errorMessage}. Received error response message from DeBounce. Error - [${data.debounce.error}]`);
        return {errorResponseReceived: true};    // in agreement with Stephen, we are keeping emails when received error response
    }
}

module.exports = {
    validateEmail: validateEmail
};
