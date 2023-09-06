const { fetchApolloPerson } = require("../apis/apolloAgent");
const { fetchReverseContactData } = require("../apis/reverseContactAgent");
const { getLeadDataFromSnov } = require("../apis/snovAgent");
const { fetchVersiumAddress, isFullVersiumAddress, fetchVersiumContactDataUsingNameAndAddress, fetchVersiumContactDataUsingEmail, fetchVersiumAddressAndEmail } = require("../apis/versiumAgent");
const { validateVersiumContactData, validateVersiumEmails } = require("../helpers/contactValidator");
const { enrichLeadWithSnovData, enrichLeadWithVersiumAddressAndEmailData, enrichLeadWithVersiumContactData, enrichLeadWithApolloData, enrichLeadWithCellPhone, enrichLeadWithAltPhone, enrichLeadWithPersonalEmail, enrichLeadWithVersiumAddressData, enrichLeadWithReverseContactData } = require("../helpers/leadEnricherHelper");
const { getCellAndAltPhones } = require("../helpers/phoneNumberValidator");
const { hasValue, exists } = require("../utils/helpers");

async function enrichLeadBasedOnLinkedInProfile(linkedInURL) {
    if (!hasValue(linkedInURL)) {
        return null;
    }

    const leadDto = {
        linkedInURL: linkedInURL
    };

    const snovLeadData = await getLeadDataFromSnov(linkedInURL)
    if (snovLeadData === null) {
        return null;
    }

    enrichLeadWithSnovData(leadDto, snovLeadData);

    if (!hasValue(leadDto.businessEmail)) { // data can not be fetched from Versium without email received from snov
        return leadDto;
    }

    const versiumAddressData = await fetchVersiumAddress(leadDto.businessEmail);
    enrichLeadWithVersiumAddressAndEmailData(leadDto, versiumAddressData);

    let versiumContactData = null;
    if (isFullVersiumAddress(versiumAddressData)) {
        versiumContactData = await fetchVersiumContactDataUsingNameAndAddress(versiumAddressData);
    } else {
        versiumContactData = await fetchVersiumContactDataUsingEmail(leadDto.businessEmail);
    }

    const validatedVersiumContactData = await validateVersiumContactData(versiumContactData);
    enrichLeadWithVersiumContactData(leadDto, validatedVersiumContactData);

    return leadDto;
}

async function enrichLeadBasedOnNameAndAddress(nameAndAddress) {
    if (!exists(nameAndAddress)) {
        return null;
    }

    let versiumAddressAndEmail = null;
    let isFullAddress = isFullVersiumAddress(nameAndAddress);
    if (!isFullAddress) {   // if the full address was not entered try to enrich it with Versium
        versiumAddressAndEmail = await fetchVersiumAddressAndEmail(nameAndAddress);
        isFullAddress = isFullVersiumAddress(versiumAddressAndEmail);
    } else {
        versiumAddressAndEmail = nameAndAddress;    // if the address is full, consider it as Versium address
    }

    if (!exists(versiumAddressAndEmail)) {
        versiumAddressAndEmail = nameAndAddress;    // use the incomplete input address if we did not pull an address from Versium
    }

    let versiumContactData = null;
    if (isFullAddress) {
        versiumContactData = await fetchVersiumContactDataUsingNameAndAddress(versiumAddressAndEmail);
    } else if (hasValue(versiumAddressAndEmail?.email)) {
        versiumContactData = await fetchVersiumContactDataUsingEmail(versiumAddressAndEmail.email);
    } else {
        versiumContactData = await fetchVersiumContactDataUsingNameAndAddress(versiumAddressAndEmail);
    }

    const reverseContactDataLookupEmail = versiumContactData?.email || versiumAddressAndEmail.email || nameAndAddress.email;
    const reverseContactData = await fetchReverseContactData(reverseContactDataLookupEmail);
    
    let validPersonalEmail = nameAndAddress.email;  // we can consider email from input as a basis for a valid personal email
    const reverseContactPersonalEmail = reverseContactData?.personalEmail || reverseContactData?.emailList?.find(email => true);
    if (hasValue(reverseContactPersonalEmail)) {
        validPersonalEmail = reverseContactPersonalEmail; // Emails gathered from Reverse Contact do not have to be validated
    } else {    // If reverse contact was not fetched or personalEmail not found, then we validate emails gathered from Versium
        const validVersiumEmail = await validateVersiumEmails(versiumContactData, versiumAddressAndEmail);
        if (hasValue(validVersiumEmail)){
            validPersonalEmail = validVersiumEmail;
        }
    }

    const [cellPhone, alternativePhone] = await getCellAndAltPhones(reverseContactData, versiumContactData);

    const leadDto = {};
    enrichLeadWithVersiumAddressData(leadDto, versiumAddressAndEmail);
    enrichLeadWithReverseContactData(leadDto, reverseContactData);
    // we do not need to enrich lead with versiumContactData here since phoneNumbers and email have already been processed

    enrichLeadWithCellPhone(leadDto, cellPhone);
    enrichLeadWithAltPhone(leadDto, alternativePhone);
    enrichLeadWithPersonalEmail(leadDto, validPersonalEmail);
    
    return leadDto;
}

async function enrichLeadBasedOnEmail(email) {
    if (!hasValue(email)) {
        return null;
    }

    const reverseContactData = await fetchReverseContactData(email);

    // we try to use reverseContact email address to go to Versium. If there is not any, we fall back to the input address from the form
    const reverseContactEmail = reverseContactData?.personalEmail || reverseContactData?.businessEmail || reverseContactData?.emailList?.find(email => true);
    const lookupEmail = reverseContactEmail || email;

    let versiumAddress;
    let versiumContactData;
    versiumAddress = await fetchVersiumAddress(lookupEmail);
    if (exists(versiumAddress)) {   // if adddress was received use it to get contact details
        versiumContactData = await fetchVersiumContactDataUsingNameAndAddress(versiumAddress);
    } else {    // if address was not received use email to get phones
        versiumContactData = await fetchVersiumContactDataUsingEmail(lookupEmail);
    }

    console.log("+++versiumContactData+++", versiumContactData);

    let validPersonalEmail = email;  // we can consider email from input as a basis for a valid personal email
    const reverseContactPersonalEmail = reverseContactData?.personalEmail || reverseContactData?.emailList?.find(email => true);
    if (hasValue(reverseContactPersonalEmail)) {
        validPersonalEmail = reverseContactPersonalEmail; // Emails gathered from Reverse Contact do not have to be validated
    } else {    // If reverse contact was not fetched or personalEmail not found, then we validate emails gathered from Versium
        const validVersiumEmail = await validateVersiumEmails(versiumContactData, versiumAddress);
        if (hasValue(validVersiumEmail)){
            validPersonalEmail = validVersiumEmail;
        }
    }

    const [cellPhone, alternativePhone] = await getCellAndAltPhones(reverseContactData, versiumContactData);

    const leadDto = {};
    enrichLeadWithVersiumAddressData(leadDto, versiumAddress);
    enrichLeadWithReverseContactData(leadDto, reverseContactData);
    // we do not need to enrich lead with versiumContactData here since phoneNumbers and email have already been processed

    enrichLeadWithCellPhone(leadDto, cellPhone);
    enrichLeadWithAltPhone(leadDto, alternativePhone);
    enrichLeadWithPersonalEmail(leadDto, validPersonalEmail);
    
    return leadDto;
}

async function enrichLeadUsingApollo(leadDto) {
    // we either use email or name+comapny to fetch data from Apollo. TODO: maybe more options?
    const apolloLookupEmail = leadDto.businessEmail || leadDto.personalEmail;
    if (!(hasValue(leadDto.firstName) && hasValue(leadDto.lastName) && hasValue(leadDto.companyName)) && !hasValue(apolloLookupEmail)) {
        console.log('Not enough parameters provided to fetch data from Apollo.');
        return;
    }

    const apolloData = await fetchApolloPerson(leadDto.firstName, leadDto.lastName, apolloLookupEmail, leadDto.companyName);
    if (apolloData) {
        enrichLeadWithApolloData(leadDto, apolloData);
    }
}

module.exports = {
    enrichLeadBasedOnLinkedInProfile: enrichLeadBasedOnLinkedInProfile,
    enrichLeadBasedOnNameAndAddress: enrichLeadBasedOnNameAndAddress,
    enrichLeadBasedOnEmail: enrichLeadBasedOnEmail,
    enrichLeadUsingApollo: enrichLeadUsingApollo,
}
