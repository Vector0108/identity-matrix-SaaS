const fetch = require('node-fetch');
const constants = require('../utils/constants');
const { hasValue } = require('../utils/helpers');


async function getLeadDataFromSnov(linkedInURL) {
    if (!hasValue(linkedInURL)) {
        console.log(`LinkedInURL passed has no value. Lead data from Snov can not be fetched.`);
    }

    // TODO: as an improvement, cache this token so it can be reused. The token is valid for 60 minutes after being generated
    const accessToken = await generateAccessToken();
    if (accessToken === null) {
        return null;
    }

    const authorizationHeader = {
        Authorization: accessToken
    }

    const addProspectUrl = constants.SNOV_ADD_PROSPECT_URL;
    const reqBody = {
        url: linkedInURL
    }

    let snovAddResult = await sendRequest(addProspectUrl, reqBody, authorizationHeader);
    if (snovAddResult === null) {
        return null;
    } else if (!snovAddResult.success) {
        console.log(`Prospect has not been successfully added on Snov. Error message received from Snov: ${snovAddResult.message}`);
        return null;
    }

    const getProspectUrl = constants.SNOV_GET_PROSPECT_URL;
    let snovProspectResult = await sendRequest(getProspectUrl, reqBody, authorizationHeader);
    if (snovProspectResult === null) {
        return null;
    } else if (!snovProspectResult.success) {
        console.log(`Prospect has not been successfully fetched from Snov. Error message received from Snov: ${snovProspectResult.message}`);
        return null;
    } else if (snovProspectResult.data === null || snovProspectResult.data === undefined) {
        console.log(`No prospects have been found in the Snov response. Snov response: ${JSON.stringify(snovProspectResult)}`);
        return null;
    }

    const snovLeadData = processProspectData(snovProspectResult.data);
    return snovLeadData;
}

async function generateAccessToken() {
    const endpointUrl = constants.SNOV_GENERATE_ACCESS_TOKEN_URL;
    const reqBody  = {
        grant_type: constants.SNOV_PROPERTY_CLIENT_CREDENTIALS,
	    client_id: process.env.SNOV_CLIENT_ID,
	    client_secret: process.env.SNOV_CLIENT_SECRET
    }

    const snovResponse = await sendRequest(endpointUrl, reqBody, {});
    if (snovResponse.success) {
        return `${snovResponse.token_type} ${snovResponse.access_token}`;
    }

    return null;
}

async function sendRequest(endpointUrl, reqBody, additionalHeaders) {
    try {
        const snovResponse = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...additionalHeaders
            },
            body: JSON.stringify(reqBody)
        });

        const data = await snovResponse.json();
        return data;
    } catch (error) {
        console.log(`An error occurred while communicating with Snov. Error - [${JSON.stringify(error)}]`);
        return null;
    }
}

function processProspectData(snovProspect) {
    const snovLeadData = {
        firstName: snovProspect.firstName,
        lastName: snovProspect.lastName,

        linkedInURL: snovProspect.sourcePage,
        linkedInLocation: snovProspect.locality,
        country: snovProspect.country,
    }

    const prospectsJob = snovProspect.currentJob?.find(job => true);
    if (prospectsJob) {
        snovLeadData.companyIndustry = snovProspect.industry || prospectsJob.industry;
        snovLeadData.companyName = prospectsJob.companyName;
        snovLeadData.currentPositionTitle = prospectsJob.position;
        snovLeadData.companyWebsiteURL = prospectsJob.site;
    }

    if (snovProspect.emails?.length > 0) {
        snovLeadData.businessEmail = snovProspect.emails[0].email;    // NOTE: we could store more emails here, but we are storing one for now
    }

    return snovLeadData;
}

module.exports = {
    getLeadDataFromSnov: getLeadDataFromSnov
}
