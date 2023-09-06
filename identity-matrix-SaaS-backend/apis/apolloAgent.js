const fetch = require('node-fetch');
const { hasValue } = require('../utils/helpers');
const constants = require('../utils/constants');

require('dotenv').config();


async function fetchApolloPerson(firstName, lastName, email, companyName) {
    if (!(hasValue(firstName) && hasValue(lastName) && hasValue(companyName)) && !hasValue(email)) {
        console.log(`There is not enough information to enrich the lead. Data from Apollo will not be fetched.`);
        return null;
    }

    const apolloURL = constants.APOLLO_PEOPLE_API;
    const reqBody = getPersonRequestBody(firstName, lastName, email, companyName);
    
    const apolloResponse = await fetchApolloData(apolloURL, reqBody);
    if (apolloResponse === null) {
        return null;
    }

    const personData = await processPersonData(apolloResponse);
    return personData;
}

async function fetchApolloData(url, reqBody) {
    try {
        const apolloResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        });

        return apolloResponse;
    } catch (error) {
        console.log(`An error occurred in communication with Apollo service. Error - [${JSON.stringify(error)}]`);
        return null;
    }
}

async function processPersonData(apolloResponse) {
    let data;
    try {
        data = await apolloResponse.json();
    } catch (error) {
        console.log(`An error occurred while attempting to extract data from Apollo response. Error - [${JSON.stringify(error)}]`);
        return null;
    }

    console.log(`Data received from ReverseContact. Data - ${JSON.stringify(data)}`);
    if (data.person === null || data.person === undefined || data.person === {}) {
        console.log(`A Person object has not been found in the response from Apollo.`);
        return null;
    }

    const person = data.person;
    let personData = {
        firstName: person.first_name || person.contact?.first_name,
        lastName: person.last_name || person.contact?.last_name,

        linkedInLocaton: person.present_raw_address || person.contact?.present_raw_address,
        linkedInURL: person.linkedin_url || person.contact?.linkedin_url,
        facebookURL: person.facebook_url || person.contact?.facebook_url,

        currentPositionTitle: person.title || person.contact?.title,
        companyName: person.organization?.name || person.contact?.organization_name,
        companyWebsiteURL: person.organization?.website_url,
        companyIndustry: person.organization?.industry,

        city: person.city,
        state: person.state,
        country: person.country,
    }

    const [businessPhones, companyPhones] = getCellPhoneNumbers(person);
    const [businessEmails, personalEmails] = getEmails(person);

    personData.businessPhones = businessPhones;
    personData.companyPhones = companyPhones;
    personData.businessEmails = businessEmails;
    personData.personalEmails = personalEmails;

    return personData;
}

function getEmails(person) {
    const businessEmails = [];
    if (hasValue(person.email)) businessEmails.push(person.email);
    if (hasValue(person.contact?.email) && !businessEmails.includes(person.contact?.email)) businessEmails.push(person.contact.email);
    
    const personalEmails = [];
    if (person.personal_emails?.length > 0) {
        person.personal_emails.forEach(email => {
            if (hasValue(email) && !personalEmails.includes(email)) personalEmails.push(email);
        });
    }

    if (person.contact?.personal_emails?.length > 0) {
        person.contact.personal_emails.forEach(email => {
            if (hasValue(email) && !personalEmails.includes(email)) personalEmails.push(email);
        });
    }

    return [businessEmails, personalEmails];
}

function getCellPhoneNumbers(person) {
    let businessPhones = [];

    let cellPhones = extractPhoneNumbers(person.phone_numbers, (numberObj) => numberObj.type === constants.FLAG_APOLLO_MOBILE);
    cellPhones.forEach(phoneNumber => {
        if (hasValue(phoneNumber) && !businessPhones.includes(phoneNumber)) businessPhones.push(phoneNumber);
    });
    cellPhones = extractPhoneNumbers(person.contact?.phone_numbers, (numberObj) => numberObj.type === constants.FLAG_APOLLO_MOBILE);
    cellPhones.forEach(phoneNumber => {
        if (hasValue(phoneNumber) &&  !businessPhones.includes(phoneNumber)) businessPhones.push(phoneNumber);
    });

    let companyPhones = [];
    let hqPhones = extractPhoneNumbers(person.phone_numbers, (numberObj) => numberObj.type === constants.FLAG_APOLLO_WORKHQ);
    hqPhones.forEach(phoneNumber => {
        if (hasValue(phoneNumber) &&  !companyPhones.includes(phoneNumber)) companyPhones.push(phoneNumber);
    });
    hqPhones = extractPhoneNumbers(person.contact?.phone_numbers, (numberObj) => numberObj.type === constants.FLAG_APOLLO_WORKHQ);
    hqPhones.forEach(phoneNumber => {
        if (hasValue(phoneNumber) &&  !companyPhones.includes(phoneNumber)) companyPhones.push(phoneNumber);
    });

    if (hasValue(person.sanitized_phone) && !businessPhones.includes(person.sanitized_phone)) {
        businessPhones.push(person.sanitized_phone);
    }
    if (hasValue(person.contact?.sanitized_phone) && !businessPhones.includes(person.contact.sanitized_phone)) {
        businessPhones.push(person.contact.sanitized_phone);
    }

    // NOTE: resolving duplicates whih can occur between businessPhones and companyPhones. This is the logic for MVP for now
    companyPhones = companyPhones.filter(phone => !businessPhones.includes(phone));

    return [Array.from(businessPhones), Array.from(companyPhones)];
}

function extractPhoneNumbers(phoneNumberList, predicate) {
    if (phoneNumberList?.length > 0) {
        const phoneNumbers = phoneNumberList.filter(predicate)
            .map(numberObj => numberObj.sanitized_number);
        
        return phoneNumbers;
    }

    return [];
}

function getPersonRequestBody(firstName, lastName, email, companyName) {
    const reqBody = {
        api_key: process.env.APOLLO_API_KEY,
        reveal_personal_emails: true,
        // reveal_phone_number: true,   // these parameters are to be used with Apollo's webhooks   
        // webhook_url: ``,             // these parameters are to be used with Apollo's webhooks
    }
    
    if (hasValue(firstName) && hasValue(lastName)) {
        reqBody.name = `${firstName} ${lastName}`;        
    }
    if (hasValue(companyName)) {
        reqBody.organization_name = companyName;
    }
    if (hasValue(email)) {
        reqBody.email = email;
    }

    return reqBody;
}

module.exports = {
    fetchApolloPerson: fetchApolloPerson,
}
