const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ListSchema = new Schema(
	{
		owner: { type: Schema.Types.ObjectId, ref: 'User' },
		name: String,
		downloadURL: String,
		loading: Boolean
	},
	{
		timestamps: true,
	}
);

const List = mongoose.model('List', ListSchema);

module.exports = { List };
