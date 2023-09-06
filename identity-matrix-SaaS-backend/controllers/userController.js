const { verifyJwtToken } = require('../middleware/jwt');
const { Card } = require('../models/card');
const { User } = require('../models/user');
const createError = require('../utils/createError');
const bcrypt = require('bcrypt')
const constants = require('../utils/constants');
const { hasValue } = require('../utils/helpers');
require('dotenv').config();

const getCards = async (req, res, next) => {
	try {
		const cards = await Card.find({ owner: req.userId })
		if (!cards.length) {
			return next(createError(404, 'User not found'));
		}
		res.status(200).send(cards)
	} catch (err) {
		next(err)
	}
}

const updateUser = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.userId });
		if (!user) return next(createError(404, 'User not found'));
		if (req.body.newPassword) {
			const isMatch = bcrypt.compareSync(
				req.body.newPassword,
				user.password
			);
			if (isMatch) return next(createError(400, 'Wrong password'));
			user.password = bcrypt.hashSync(req.body.newPassword, 5);
			await user.save();
		} else {
			const user = await User.findOne({ _id: req.userId })
			const existWithEmail = await User.findOne({ email: req.body.email })
			if (existWithEmail) {
				return next(createError(400, 'Email already exists'));
			}
			if (user.email == req.body.email && !req.body.name) {
				return next(createError(400, 'Email already exists'));
			}
			user.first = req.body.name ? req.body.name : user.first;
			user.last = req.body.lastName ? req.body.lastName : user.last;
			user.email = req.body.email ? req.body.email : user.email;
			await user.save();
		}
		res.status(200).send('User updated');
	} catch (e) {
		next(e);
	}
};

const getUser = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.userId });
		if (!user) return createError(404, 'User not found');
		const { password, ...info } = user._doc
		res.status(200).send(info);
	} catch (e) {
		next(e)
	}
};

const disableFirstLogin = async (req, res, next) => {
	const user = await User.findOne({ _id: req.userId })
	if (!user) return next(createError(404, 'User not found'));
	user.firstLogin = false
	await user.save()
	res.send("successful")
}

module.exports = {
	getUser,
	updateUser,
	getCards,
	disableFirstLogin,
}
