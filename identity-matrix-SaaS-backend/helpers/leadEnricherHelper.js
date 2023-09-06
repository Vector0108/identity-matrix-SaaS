const { exists, hasValue } = require("../utils/helpers");

function enrichLeadWithApolloData(leadDto, apolloData) {
    if (!exists(apolloData) || !exists(leadDto)) {
        return;
    }

    leadDto.firstName = apolloData.firstName || leadDto?.firstName
    leadDto.lastName = apolloData.lastName || leadDto?.lastName

    leadDto.personalEmail = apolloData.personalEmails?.length > 0 ? apolloData.personalEmails[0] : leadDto?.personalEmail,
    leadDto.businessEmail = apolloData.businessEmails?.length > 0 ? apolloData.businessEmails[0] : leadDto?.businessEmail,
    leadDto.businessPhone = apolloData.businessPhones?.length > 0 ? apolloData.businessPhones[0] : leadDto?.businessPhone,
    leadDto.companyPhone = apolloData.companyPhones?.length > 0 ? apolloData.companyPhones[0] : leadDto?.companyPhone,
    leadDto.cellPhone = apolloData.cellPhone || leadDto?.cellPhone
    leadDto.altPhone = apolloData.altPhone || leadDto?.altPhone
    
    leadDto.linkedInLocation = apolloData.linkedInLocation || leadDto?.linkedInLocation,
    leadDto.linkedInURL = apolloData.linkedInURL || leadDto?.linkedInURL
    leadDto.facebookURL = apolloData.facebookURL,

    leadDto.currentPositionTitle = apolloData.currentPositionTitle || leadDto?.currentPositionTitle
    leadDto.companyName = apolloData.companyName || leadDto?.companyName
    leadDto.companyWebsiteURL = apolloData.companyWebsiteURL || leadDto?.companyWebsiteURL
    leadDto.companyIndustry = apolloData.companyIndustry || leadDto?.companyIndustry
    
    leadDto.city = apolloData.city || leadDto?.city
    leadDto.state = apolloData.state || leadDto?.state
    leadDto.country = apolloData.country || leadDto?.country

    leadDto.enriched = true;
}

function enrichLeadWithSnovData(leadDto, snovData) {
    if (!exists(snovData) || !exists(leadDto)) {
        return;
    }

    leadDto.firstName = snovData.firstName || leadDto.firstName;
    leadDto.lastName = snovData.lastName || leadDto.lastName;
    leadDto.businessEmail = snovData.businessEmail || leadDto.businessEmail;
    leadDto.linkedInURL = snovData.linkedInURL || leadDto.linkedInURL;
    leadDto.linkedInLocation = snovData.linkedInLocation || leadDto.linkedInLocation;
    leadDto.country = snovData.country || leadDto.country;
    leadDto.companyIndustry = snovData.companyIndustry || leadDto.companyIndustry;
    leadDto.companyName = snovData.companyName || leadDto.companyName;
    leadDto.currentPositionTitle = snovData.currentPositionTitle || leadDto.currentPositionTitle;
    leadDto.companyWebsiteURL = snovData.companyWebsiteURL || leadDto.companyWebsiteURL;

    leadDto.enriched = true;
}

function enrichLeadWithVersiumAddressData(leadDto, versiumAddressAndEmail) {
    if (!exists(versiumAddressAndEmail) || !exists(leadDto)) {
        return;
    }

    leadDto.firstName = versiumAddressAndEmail.firstName || leadDto.firstName;
    leadDto.lastName = versiumAddressAndEmail.lastName || leadDto.lastName;
    leadDto.address = versiumAddressAndEmail.street || leadDto.address;
    leadDto.city = versiumAddressAndEmail.city || leadDto.city;
    leadDto.state = versiumAddressAndEmail.state || leadDto.state;
    leadDto.zip = versiumAddressAndEmail.zip || leadDto.zip;
    leadDto.country = versiumAddressAndEmail.country || leadDto.country;

    leadDto.enriched = true;
}

function enrichLeadWithVersiumAddressAndEmailData(leadDto, versiumAddressAndEmail) {
    if (!exists(versiumAddressAndEmail) || !exists(leadDto)) {
        return;
    }

    leadDto.firstName = versiumAddressAndEmail.firstName || leadDto.firstName;
    leadDto.lastName = versiumAddressAndEmail.lastName || leadDto.lastName;
    leadDto.personalEmail = versiumAddressAndEmail.email || leadDto.personalEmail;
    leadDto.address = versiumAddressAndEmail.street || leadDto.address;
    leadDto.city = versiumAddressAndEmail.city || leadDto.city;
    leadDto.state = versiumAddressAndEmail.state || leadDto.state;
    leadDto.zip = versiumAddressAndEmail.zip || leadDto.zip;
    leadDto.country = versiumAddressAndEmail.country || leadDto.country;

    leadDto.enriched = true;
}

function enrichLeadWithVersiumContactData(leadDto, versiumContactData) {
    if (!exists(versiumContactData) || !exists(leadDto)) {
        return;
    }

    leadDto.firstName = versiumContactData.firstName || leadDto.firstName;
    leadDto.lastName = versiumContactData.lastName || leadDto.lastName;
    leadDto.personalEmail = leadDto.personalEmail || versiumContactData.email;
    leadDto.cellPhone = leadDto.cellPhone || versiumContactData.cellPhone;      // NOTE: quality of numbers: apollo > reverseContact > versium

    if (versiumContactData.isAltPhoneLandline) {    // NOTE: altPhone is intended to be a landline, if not then a second cell phone
        leadDto.altPhone = versiumContactData.altPhone || leadDto.altPhone
    } else {
        leadDto.altPhone = leadDto.altPhone || versiumContactData.altPhone
    }

    leadDto.enriched = true;
}

function enrichLeadWithReverseContactData(leadDto, reverseContactData) {
    if (!exists(reverseContactData) || !exists(leadDto)) {
        return;
    }

    leadDto.firstName = reverseContactData.firstName || leadDto.firstName;
    leadDto.lastName = reverseContactData.lastName || leadDto.lastName;
    leadDto.businessEmail = reverseContactData.businessEmail || leadDto.businessEmail;
    leadDto.personalEmail = reverseContactData.personalEmail || leadDto.personalEmail;

    leadDto.linkedInURL = reverseContactData.linkedInURL || leadDto.linkedInURL;
    leadDto.linkedInLocation = reverseContactData.linkedInLocation || leadDto.linkedInLocation;
    leadDto.companyIndustry = reverseContactData.companyIndustry || leadDto.companyIndustry;
    leadDto.companyName = reverseContactData.companyName || leadDto.companyName;
    leadDto.currentPositionTitle = reverseContactData.currentPositionTitle || leadDto.currentPositionTitle;
    leadDto.companyWebsiteURL = reverseContactData.companyWebsiteURL || leadDto.companyWebsiteURL;

    leadDto.enriched = true;
}

function enrichLeadWithCellPhone(leadDto, cellPhone) {
    if (!hasValue(cellPhone)) {
        return;
    }

    leadDto.cellPhone = cellPhone;
    leadDto.enriched = true;
};

function enrichLeadWithAltPhone(leadDto, altPhone) {
    if (!hasValue(altPhone)) {
        return;
    }
    
    leadDto.altPhone = altPhone;
    leadDto.enriched = true;
};

function enrichLeadWithPersonalEmail(leadDto, personalEmail) {
    if (!hasValue(personalEmail)) {
        return;
    }

    leadDto.personalEmail = personalEmail;
    leadDto.enriched = true;
}


module.exports = {
    enrichLeadWithApolloData: enrichLeadWithApolloData,
    enrichLeadWithSnovData: enrichLeadWithSnovData,
    enrichLeadWithVersiumAddressData: enrichLeadWithVersiumAddressData,
    enrichLeadWithVersiumAddressAndEmailData: enrichLeadWithVersiumAddressAndEmailData,
    enrichLeadWithVersiumContactData: enrichLeadWithVersiumContactData,
    enrichLeadWithReverseContactData: enrichLeadWithReverseContactData,    
    enrichLeadWithCellPhone: enrichLeadWithCellPhone,
    enrichLeadWithAltPhone: enrichLeadWithAltPhone,
    enrichLeadWithPersonalEmail: enrichLeadWithPersonalEmail,
}
