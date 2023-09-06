const bcrypt = require('bcrypt');
const crypto = require('crypto');
const constants = require('./constants');

function hasValue(entry) {
    if (entry === undefined || entry === null) {
        return false;
    }

    return entry.trim() !== '';
}

function exists(obj) {
    return obj !== undefined && obj !== null;
} 

function getPasswordHash(password) {
    const passwordHash = bcrypt.hashSync(password, 5);

    return passwordHash;
}

function createNewPassword() {
    let newPassword = crypto.randomBytes(5).toString('hex');

    return newPassword;
}

function hasUnlimitedCredits(email) {
    const splitedEmail = email.split('@')[1]
    const unlimitedCredits = splitedEmail === constants.REVENUE_INSTITUTE_DOMAIN;

    return unlimitedCredits;
}

function isPartner(email) {
    const splitedEmail = email.split('@')[1]
    const partner = constants.PARTNERS.includes(splitedEmail);

    return partner;
}

module.exports = {
    hasValue: hasValue,
    exists: exists,
    getPasswordHash: getPasswordHash,
    createNewPassword: createNewPassword,
    hasUnlimitedCredits: hasUnlimitedCredits,
    isPartner: isPartner
}
