const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcryptSalt = process.env.BCRYPT_SALT;
const createError = require('../utils/createError');
const { hasValue } = require('../utils/helpers');
const { getUser, getUserFromActivationToken } = require('../repositories/userRepository');
const constants = require('../utils/constants');


async function validateNewUserCredentials(email, password) {
    if (!hasValue(email) || !hasValue(password)) {
        return {
            httpCode: 400,
            message: constants.MESSAGE_CREDENTIALS_NOT_PROVIDED
        };
    }

    try {
        const user = await getUser(email);

        if (user !== null) {
            return {
                httpCode: 409,
                message: constants.MESSAGE_ACCOUNT_ALREADY_EXISTS
            };
        }
    } catch (error) {
        return {
            httpCode: 500,
            message: constants.MESSAGE_UNSUCCESSFUL_LOGIN_ATTEMPT
        };
    }

    return null;

    
}

async function authenticateUser(email, password) {
    let user;
    try {
        user = await getUser(email);
        
        if (user === null) {
            return [null, null, {
                httpCode: 400,
                message: 'Wrong password or username'
            }];
        }
    } catch (error) {
        return [null, null, {
            httpCode: 500,
            message: 'Please try to login again'
        }];
    }

    const isPasswordValid = validatePassword(password, user);
    if (!isPasswordValid) {
        console.log(`Unsucessful login attempt registered for user with email: ${user.email}. Password entered is incorrect.`);
        return [null, null, {
            httpCode: 404,
            message: 'Wrong password or username'
        }]
    }
    
    const jwtToken = createJwt(user);

    return [user, jwtToken, null];
}

function createJwt(user) {
    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.JWT_KEY,
        {
            expiresIn: '12h',
        }
    );

    return token;
}

function validatePassword(password, user) {
    const isCorrect = bcrypt.compareSync(password, user.password);	
    return isCorrect;
}

async function getUserFromJwt(jwtToken) {
    const user = await getUserFromActivationToken(jwtToken);

    return user;
}

async function getUserData(email) {
    const user = await getUser(email);

    return user;
}

module.exports = {
    authenticateUser: authenticateUser,
    getUserData: getUserData,
    validateNewUserCredentials: validateNewUserCredentials,
    getUserFromJwt: getUserFromJwt
}
