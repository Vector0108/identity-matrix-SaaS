const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CardSchema = new Schema({
    brand: {
        type: String,
    },
    lastFour: {
        type: String
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    customerId: {
        type: String
    },
    cardId: {
        type: String
    }
});

const Card = mongoose.model('Card', CardSchema);

module.exports = { Card };