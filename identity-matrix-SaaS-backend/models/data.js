const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DataSchema = new Schema({
	list: { type: Schema.Types.ObjectId, ref: 'List' },
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	company: String,
	firstName: String,
	lastName: String,
	title: String,
	linkedInURL: String,
	facebookURL: String,
	linkedInLocation: String,

	cellPhone: String,
	altPhone: String,	// holds the value of a second cell phone or a landline
	businessPhone: String,
	companyPhone: String,
	personalEmail: String,
	businessEmail: String,

	address: String,
	city: String,
	state: String,
	zip: String,
	country: String,
	enriched: Boolean,
});

const Data = mongoose.model('Data', DataSchema);

module.exports = { Data };
