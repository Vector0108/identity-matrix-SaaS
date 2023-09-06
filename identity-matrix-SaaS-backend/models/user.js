const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	first: {
		type: String,
		required: true,
	},
	last: {
		type: String,
		required: true,
	},
	company: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true
	},
	credits: {
		type: Number,
		required: true,
	},
	unlimitedCredits: {
		type: Boolean,
	},
	partner: {
		type: Boolean,
	},
	firstLogin: {
		type: Boolean,
	},
	verifiedEmail: {
		type: Boolean
	},
	sentEmail: {
		type: Boolean
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
