const { List } = require("../models/list");


async function getUsersLeadLists(userId) {
    try {
        const leadLists = await List.find({ owner: userId });

        return leadLists;
    } catch (error) {
        console.log(`An error has occurred while attempting to get lead lists for userId: ${userId}. Error - [${JSON.stringify(error)}]`);
        throw new Error();
    }
}

module.exports = {
    getUsersLeadLists: getUsersLeadLists
}
