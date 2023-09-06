const { Data } = require("../models/data");
const { hasValue } = require("../utils/helpers");


function mapCollectedDataToLead(versiumAddressData, versiumContactData, reverseContactData, mobilePhone, alternativePhone,
    initialLeadData) {

    console.log(`Trying to build a lead based on: {
        \ninitialLeadData: ${JSON.stringify(initialLeadData)},
        \nversiumAddressData: ${JSON.stringify(versiumAddressData)},
        \nversiumContactData: ${JSON.stringify(versiumContactData)},
        \nreverseContactData: ${JSON.stringify(reverseContactData)},
        \nmobilePhone: ${mobilePhone},
        \nalternativePhone: ${alternativePhone}
    `);

    const [personalEmail, businessEmail] = getMainEmails(versiumContactData, reverseContactData, initialLeadData.email);
    
    let leadDTO = {
        listId: initialLeadData.listId,
        owner: initialLeadData.owner,

        firstName: initialLeadData.firstName || reverseContactData?.firstName
            || versiumContactData?.firstName || versiumAddressData?.firstName,
        lastName: initialLeadData.lastName || reverseContactData?.lastName
            || versiumContactData?.lastName || versiumAddressData?.lastName,

        linkedInURL: reverseContactData?.linkedInURL || initialLeadData.linkedInURL,

        cellPhone: mobilePhone,
        altPhone: alternativePhone,
        businessPhone: null,
        companyPhone: null,
        personalEmail: personalEmail,
        businessEmail: businessEmail,

        linkedInLocation: reverseContactData?.linkedInLocation,
        address: initialLeadData.address || versiumAddressData?.street,
        city: initialLeadData.city || versiumAddressData?.city,
        state: initialLeadData.state || versiumAddressData?.state,
        zip: initialLeadData.zip || versiumAddressData?.zip,
        country: initialLeadData.country || versiumAddressData?.country,

        companyName: reverseContactData?.companyName || initialLeadData.companyName,
        companyWebsiteURL: reverseContactData?.companyWebsiteURL,
        companyIndustry: reverseContactData?.companyIndustry,
        currentPositionTitle: reverseContactData?.currentPositionTitle || initialLeadData.currentPositionTitle,
    };

    if (versiumAddressData !== null || versiumContactData !== null
        || reverseContactData !== null || mobilePhone !== null || alternativePhone !== null) {
        leadDTO.enriched = true;
    }

    console.log(`LeadDTO has been created: [${JSON.stringify(leadDTO)}]`);

    return leadDTO;
}

function getMainEmails(versiumContactData, reverseContactData, initialLeadDataEmail) {
    let businessEmail = reverseContactData?.businessEmail;
    let personalEmail = reverseContactData?.personalEmail;

    if (!(hasValue(personalEmail)) && reverseContactData?.emailList.length > 0) {
        personalEmail = reverseContactData.emailList[0];
    }

    if (!(hasValue(personalEmail))) {
        personalEmail = versiumContactData?.email;
    }

    if (!hasValue(personalEmail)) {
        personalEmail = initialLeadDataEmail;   // TODO: clarify how this will be handled. Email from the form could be both personal and professional
    }

    return [businessEmail, personalEmail];
}

/* NOTE: logic of this method currently not used. getBestPhoneNumbers method is used to validate numbers before using them
function getMainPhones(versiumContactData, reverseContactData) {
    let altPhone = null;
    if (versiumContactData.landPhones?.length > 0) {
        altPhone = versiumContactData.landPhones[0];
    }

    let cellPhone = null;
    if (reverseContactData.phoneNumbers?.length > 0) {
        cellPhone = reverseContactData.phoneNumbers[0];
        if (hasValue(altPhone)) {
            return [cellPhone, altPhone];
        }
        if (reverseContactData.phoneNumbers.length > 1) {
            for (let i = 0; i < reverseContactData.phoneNumbers.length; i++) {
                if (reverseContactData.phoneNumbers[i] !== cellPhone) {
                    altPhone = reverseContactData.phoneNumbers[i];
                    return [cellPhone, altPhone];
                }
            }
        }
    }

    if (versiumContactData.mobilePhones?.length > 0) {
        for (let i = 0; i < versiumContactData.mobilePhones.length; i++) {
            if (!hasValue(cellPhone)) {
                cellPhone = versiumContactData.mobilePhones[i];
                if (hasValue(altPhone)) {
                    return [cellPhone, altPhone];
                }
            } else if (!hasValue(altPhone) && versiumContactData.mobilePhones[i] !== cellPhone) {
                 altPhone = versiumContactData.mobilePhones[i];
                 return [cellPhone, altPhone];  // cellPhone is set in this case so we can return
            }
        }
    }

    return [cellPhone, altPhone];
}*/

async function toMAP(leadDTO) {
    return await Data.create({
        list: leadDTO.listId,
        owner: leadDTO.owner,

        firstName: leadDTO.firstName,
        lastName: leadDTO.lastName,

        company: leadDTO.companyName,
        title: leadDTO.currentPositionTitle,

        linkedInURL: leadDTO.linkedInURL,
        facebookURL: leadDTO.facebookURL,
        
        cellPhone: leadDTO.cellPhone,
        altPhone: leadDTO.altPhone,
        businessPhone: leadDTO.businessPhone,
        companyPhone: leadDTO.companyPhone,
        personalEmail: leadDTO.personalEmail,
        businessEmail: leadDTO.businessEmail,
        
        linkedInLocation: leadDTO.linkedInLocation,
        address: leadDTO.address,
        city: leadDTO.city,
        state: leadDTO.state,
        zip: leadDTO.zip,
        country: leadDTO.country,

        enriched: leadDTO.enriched,
    }); 
}

module.exports = {
    mapCollectedDataToLead: mapCollectedDataToLead,
    toMAP: toMAP
}
