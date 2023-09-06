const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
		note: String,
		amount: Number,
		type: Boolean
	},
	{
		timestamps: true,
	}
);

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = { Transaction };


// type  = true - incoming, false - outgoing