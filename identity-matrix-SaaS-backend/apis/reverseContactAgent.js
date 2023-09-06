const fetch = require('node-fetch');
const { hasValue } = require('../utils/helpers');
const constants = require('../utils/constants');
const API_KEY = process.env.REVERSECONTACT_API
const url = 'https://api.reversecontact.com/'

async function fetchReverseContactData(email) {
    if (!hasValue(email)) {
        console.log('Email has not been passed to fetchReverseContactData. Data from Reverse Contact can not be fetched.');
        return null;
    }
    let response = null;
    try {
        response = await fetch(`${url}enrichment?apikey=${API_KEY}&mail=${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.log(`An error occurred while attempting to fetch data from Reverse Contact. Email sent: ${email}. - {${JSON.stringify(error)}}`);
        return null;
    }

    const reverseContactData = await processReverseContactResponse(response);
    return reverseContactData;
}

async function processReverseContactResponse(response) {
    let data;
    try {
        data = await response.json();
    } catch (error) {
        console.log(`An error occurred while attempting to process response received from Reverse Contact. - {${JSON.stringify(error)}}`);
        return null;
    }

    console.log(`Data received from ReverseContact. Data - ${JSON.stringify(data)}`);
    
    if (data.success) {
        if (data.person !== false) { // person = false || Profile object
            let reverseContactData = {
                firstName: entryHasValue(data.person.firstName) ? data.person.firstName : null,
                lastName: entryHasValue(data.person.lastName) ? data.person.lastName : null,
                linkedInLocation: entryHasValue(data.person.location) ? data.person.location : null, // NOTE: in format <city country/location>. Collected and shown as linkedIn location
                linkedInURL: entryHasValue(data.person.linkedInUrl) ? data.person.linkedInUrl : null,
                phoneNumbers: [],
                emailList: [],
                businessEmail: data.emailType === constants.REVERSECONTACT_EMAIL_TYPE_PROFESSIONAL
                    ? data.email : null,
                personalEmail: data.emailType === constants.REVERSECONTACT_EMAIL_TYPE_PERSONAL
                    ? data.email : null,
                companyName: entryHasValue(data.company?.name) ? data.company.name : null,
                companyWebsiteURL: entryHasValue(data.company?.websiteUrl) ? data.company?.websiteUrl : null,
                companyIndustry: entryHasValue(data.company?.industry) ? data.company?.industry : null,
                currentPositionTitle: null
            };

            // numbers at lower indices are of higher quaility
            if (data.person.phoneNumbers?.length > 0) {  // an array of strings, not a string as documentation claims
                data.person.phoneNumbers.forEach(phoneNumber => {
                    if (entryHasValue(phoneNumber) && !reverseContactData.phoneNumbers.includes(phoneNumber)) {
                        reverseContactData.phoneNumbers.push(phoneNumber);
                    }
                });
            }

            if (data.person.positions && data.person.positions !== {} && data.person.positions.positionsCount > 0) {
                reverseContactData.currentPositionTitle = data.person.positions.positionHistory[0].title; // index 0 carries the last taken position
            }

            if (data.person.emails?.length > 0) {
                data.person.emails.forEach(email => {
                    if (entryHasValue(email) && !reverseContactData.emailList.includes(email)) {
                        reverseContactData.emailList.push(email);
                    }
                });
            }

            return reverseContactData;
        } else {
            console.log(`Information has not been found on ReverseContact for email-${data.email}.`);
            return null;
        }
    } else {
        // possible response codes: 400, 401, 402, 403, 500.
        // NOTE: based on the talk with Stephen. When we receive response 402, in the next version we could add credits to the account
        console.log(`The request to fetch data from Reverse Contect was not successful. Error received: {\nerrorTitle: ${data.title},\nerrorMessage:${data.msg}\n}`);
        return null;
    }
}

function entryHasValue(entry) {
    if (entry === null || entry === undefined) {
        return false;
    }

    entry = entry.trim();
    return entry !== '';
}

module.exports = {
    fetchReverseContactData: fetchReverseContactData
}
