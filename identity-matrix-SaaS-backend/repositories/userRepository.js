const { toMAP } = require("../mappers/userMapper");
const { User } = require("../models/user");
const { createNewPassword, getPasswordHash } = require("../utils/helpers");

async function getUser(email) {
    try {
        const userMAP = await User.findOne({ email: email });

        if (userMAP === null || userMAP === undefined) {
            console.log(`User with email=${email} does not exist`);
            return null;
        }
        
        return userMAP;
    } catch (error) {
        console.log(`An error has occurred while fetching the user with email=${email} from the database. Error - [${JSON.stringify(error)}]`);
        throw new Error();
    }
}

async function createUser(userDTO) {
    try {
        const userMAP = toMAP(userDTO);
        await userMAP.save();
    } catch (error) {
        console.log(`An error has occurred while attempting to store new user with email: ${userDTO.email}. Error - [${JSON.stringify(error)}]`);
        throw new Error();
    }
}

async function setNewPassword(user) {
    const newPassword = createNewPassword();
    const passwordHash = getPasswordHash(newPassword);

    user.password = passwordHash;
	
    try {
        await user.save();

        return newPassword;
    } catch (error) {
        console.log(`An error has occurred while attempting to update password for the user with email: ${user.email}. Error - [${JSON.stringify(error)}]`);
        throw new Error();
    }
}

async function setSentEmail(user) {
    try {
        user.sentEmail = true
        await user.save();
    } catch (error) {
        console.log(`An error has occurred while setting sentEmail flag for the user with email: ${user.email}. Error - [${JSON.stringify(error)}]`);
        throw new Error();
    }

}

// TODO: token should not be connected to the id. Rearrange this!
async function verifyUserAccount(token) {
    const user = await getUserFromActivationToken(token);

    try {
        user.verifiedEmail = true
        await user.save();
    } catch (error) {
        console.log(`An error has occurred while attempting to validate account for user with id=${token}. Error - [${JSON.stringify(error)}]`);
        throw new Error();
    }

}

// TODO: token should not be connected to the id. Rearrange this!
async function getUserFromActivationToken(token) {
    try {
        const userMAP = await User.findOne({ _id: token });

        if (userMAP === null || userMAP === undefined) {
            console.log(`User with id=${token} does not exist`);
            return null;
        }
        
        return userMAP;
    } catch (error) {
        console.log(`An error has occurred while fetching the user with id=${token} from the database. Error - [${JSON.stringify(error)}]`);
        throw new Error();
    }
}

module.exports = {
    getUser: getUser,
    createUser: createUser,
    setNewPassword: setNewPassword,
    setSentEmail: setSentEmail,
    verifyUserAccount: verifyUserAccount,
    getUserFromActivationToken: getUserFromActivationToken,
}
