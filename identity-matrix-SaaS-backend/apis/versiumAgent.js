const fetch = require('node-fetch');
const { exists, hasValue } = require('../utils/helpers');
const VERSIUM_URL = 'https://api.versium.com/v2/contact';

async function fetchVersiumAddressAndEmail(nameAddressData) {
    if (!exists(nameAddressData)) {
        console.log('Name address data object has not been passed to fetchVersiumAddressAndEmail. Data from Versium can not be fetched.');
        return null;
    }

    const queryString = getVersiumAddressQueryString(nameAddressData);
    const outputs = 'output[]=address&email';
    
    let response = await fetchDataFromVersium(queryString, outputs);
    if (response === null) {
        return null;
    }

    const [addressData, email] = await processAddressDataResponse(response, true);
    if (addressData === null && email === null) {
        return null;
    }

    return {...addressData, email: email};
}

async function fetchVersiumAddress(email) {
    if (!hasValue(email)) {
        console.log('Email has not been passed to fetchVersiumAddress. Address data from Versium can not be fetched.');
        return null;
    }

    const queryString = { email: email };
    const outputs = 'output[]=address';
    
    let response = await fetchDataFromVersium(queryString, outputs);
    if (response === null) {
        return null;
    }

    const [addressData, _] = await processAddressDataResponse(response, false);
    return addressData;
}

async function fetchVersiumContactDataUsingEmail(email) {
    if (!hasValue(email)) {
        console.log('Email has not been passed to fetchVersiumContactDataUsingEmail. Contact data from Versium can not be fetched.');
        return null;
    }

    const queryString = { email: email };
    const outputs = 'output[]=phone_multiple&output[]=email';
    
    let response = await fetchDataFromVersium(queryString, outputs);
    if (response === null) {
        return null;
    }

    const contactData = await processContactDataResponse(response);
    return contactData;
}

async function fetchVersiumContactDataUsingNameAndAddress(nameAddressData) {
    if (!exists(nameAddressData)) {
        console.log('Name and address data has not been passed to fetchVersiumContactDataUsingNameAndAddress. Data from Versium can not be fetched.');
        return null;
    }

    const queryString = getVersiumAddressQueryString(nameAddressData);
    const outputs = 'output[]=phone_multiple&output[]=email';
    
    let response = await fetchDataFromVersium(queryString, outputs);
    if (response === null) {
        return null;
    }

    const contactData = await processContactDataResponse(response);
    return contactData;
}

async function fetchDataFromVersium(queryString, versiumOutputs) {
    const params = new URLSearchParams(queryString).toString();
    const versiumURL = `${VERSIUM_URL}?${versiumOutputs}&${params}`;

    try {
        const response = await fetch(versiumURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Versium-Api-Key': process.env.VERSIUM_KEY,
            },
        });
    
        console.log(`Versium response received for queryString=${JSON.stringify(queryString)}. Response: ${JSON.stringify(response)}`);
        return response;
    } catch (error) {
        console.log(`An error occurred while attempting to fetch data from Versium. Error - {${JSON.stringify(error)}}`);
        return null;
    }
}

async function processAddressDataResponse(response, isEmailRequested) {
    let data;
    try {
        data = await response.json();
        console.log(`Address data received from Versium. Data - ${JSON.stringify(data)}`);
    } catch (error) {
        console.log(`An error occurred while attempting to process address response received from Versium. Error - ${JSON.stringify(error)}`);
        return [null, null];
    }

	if (data?.versium?.num_matches <= 0) {
        console.log(`No address matches have been found on Versium.`);
        return [null, null];
    }

    const contactData = data.versium.results[0];
    let addressData = {
        firstName: entryHasValue(contactData['First Name']) ? contactData['First Name'] : null,
        lastName: entryHasValue(contactData['Last Name']) ? contactData['Last Name'] : null,
        street: entryHasValue(contactData['Postal Address']) ? contactData['Postal Address'] : null,   // combination of two fields address1 and address 2
        city: entryHasValue(contactData['City']) ? contactData['City'] : null,
        state: entryHasValue(contactData['State']) ? contactData['State'] : null,
        zip: entryHasValue(contactData['Zip']) ? contactData['Zip'] : null,
        country: entryHasValue(contactData['Country']) ? contactData['Country'] : null
    };

    if (isEmailRequested) {
        const email = entryHasValue(contactData['Email Address']) ? contactData['Email Address'] : null;
        return [addressData, email];
    }

    return [addressData, null];
}

async function processContactDataResponse(response) {
    let data;
    try {
        data = await response.json();
        console.log(`Contact data received from Versium. Data - ${JSON.stringify(data)}`);
    } catch (error) {
        console.log(`An error occurred while attempting to process address response received from Versium. Error - ${JSON.stringify(error)}`);
        return null;
    }

    if (data?.versium?.num_matches <= 0) {
        console.log(`No contact data matches have been found on Versium.`);
        return null;
    }

    const contactDataRes = data.versium.results[0];
    let contactData = {
        firstName: entryHasValue(contactDataRes['First Name']) ? contactDataRes['First Name'] : null,
        lastName: entryHasValue(contactDataRes['Last Name']) ? contactDataRes['Last Name'] : null,
        email: entryHasValue(contactDataRes['Email Address']) ? contactDataRes['Email Address'] : null,
        cellPhones: [],
        landPhones: [],
    };
    
    if (entryHasValue(contactDataRes['Phone'])) {
        if (contactDataRes['Line Type'] === 'Mobile') {
            contactData.cellPhones.push(contactDataRes['Phone']);
        }
        else if (contactDataRes['Line Type'] === 'Landline'){
            contactData.landPhones.push(contactDataRes['Phone']);
        }
        else {
            console.log(`Unrecognized type of phone has been found: {phone: ${contactDataRes['Phone']}, lineType: ${contactDataRes['Line Type']}}`);
        }
    }
    
    for (let i = 1; i <= 5; i++) {  // there are maximum 5 alternative numbers
        const curPhoneType = contactDataRes[`Alt Line Type ${i}`];
        if (!entryHasValue(curPhoneType)) {
            continue;
        }

        // line type can be 'Mobile', or 'Landline'
        if (curPhoneType === 'Mobile') {
            if (!contactData.cellPhones.includes(contactDataRes[`Alt Phone ${i}`])) {
                contactData.cellPhones.push(contactDataRes[`Alt Phone ${i}`]);
            }
        } else if (curPhoneType === 'Landline') {
            if (!contactData.landPhones.includes(contactDataRes[`Alt Phone ${i}`])) {
                contactData.landPhones.push(contactDataRes[`Alt Phone ${i}`]);
            }
        } else {
            console.log(`Unrecognized type of phone has been found: {phone: ${contactDataRes[`Alt Phone ${i}`]}, lineType: ${curPhoneType}}`);
        }
    }
    
    return contactData;
}

function isFullVersiumAddress(versiumAddressData) {
    if (!exists(versiumAddressData)) {
        console.log('Passed Versium address data is null or undefined.');
        return false;
    }

    const isFullVersiumAddress = entryHasValue(versiumAddressData.firstName) && entryHasValue(versiumAddressData.lastName)
        && entryHasValue(versiumAddressData.street) && entryHasValue(versiumAddressData.city)
        && entryHasValue(versiumAddressData.state) && entryHasValue(versiumAddressData.zip);

    console.log(`${JSON.stringify(versiumAddressData)} is a full versium address: [${isFullVersiumAddress}]`);
    return isFullVersiumAddress;
}

function getVersiumAddressQueryString(address) {
    let queryString = {
        first: address.firstName,
        last: address.lastName
    };

    if (address.street) queryString.address = address.street;   // should be a number and a street. address2 is said to be unitNumber or a suite
    if (address.city) queryString.city = address.city;
    if (address.state) queryString.state = address.state;
    if (address.zip) queryString.zip = address.zip;
    if (address.country) queryString.country = address.country;

    return queryString;
}

function entryHasValue(entry) {
    if (entry === null || entry === undefined) {
        return false;
    }

    entry = entry.trim();
    return entry !== 'Unknown' && entry !== '';
}

module.exports = {
    fetchVersiumAddress: fetchVersiumAddress,
    fetchVersiumAddressAndEmail: fetchVersiumAddressAndEmail,
    fetchVersiumContactDataUsingEmail: fetchVersiumContactDataUsingEmail,
    fetchVersiumContactDataUsingNameAndAddress: fetchVersiumContactDataUsingNameAndAddress,
    isFullVersiumAddress: isFullVersiumAddress,
}
