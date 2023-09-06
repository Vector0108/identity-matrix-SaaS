const constants = require("../utils/constants");
const { hasUnlimitedCredits, isPartner } = require("../utils/helpers");

function UserDTO(firstName, lastName, email, password, companyName) {
    const unlimitedCredits = hasUnlimitedCredits(email);
    const partner = isPartner(email); 

    const userDTO = {
        firstName: firstName,
        lastName: lastName,
        companyName: companyName,
        email: email,
        password: password,
        credits: constants.NEW_USER_CREDITS,
        unlimitedCredits: unlimitedCredits,
        partner: partner,
        firstLogin: true,
        verifiedEmail: false,
        sentEmail: false
    };

    return userDTO;
}

module.exports = {
    UserDTO: UserDTO
}
