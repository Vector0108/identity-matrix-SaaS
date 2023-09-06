const { User } = require("../models/user");

function toMAP(userDTO) {
    return new User({
        first: userDTO.firstName,
        last: userDTO.lastName,
        company: userDTO.companyName,
        email: userDTO.email,
        password: userDTO.password,
        credits: userDTO.credits,
        unlimitedCredits: userDTO.unlimitedCredits,
        partner: userDTO.partner,
        firstLogin: userDTO.firstLogin,
        verifiedEmail: userDTO.verifiedEmail,
        sentEmail: userDTO.sentEmail
    });
}

module.exports = {
    toMAP: toMAP
}
