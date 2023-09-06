const { User } = require('../models/user');
const { Transaction } = require('../models/transaction');
const { Card } = require('../models/card')
const createError = require('../utils/createError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (data) => {
	switch (data) {
		case '20':
			return 15;
		case '50':
			return 35;
		case '100':
			return 65;
		case '500':
			return 300;
		case '1000':
			return 500;
		case '5000':
			return 2400;
		case '10000':
			return 4600;
		case '50000':
			return 21000;
		case '100000':
			return 40000;
		default:
			return 0;
	}
};

const calculatePartnerOrder = (data) => {
	return data * 0.25
}

const deleteCard = async (req, res, next) => {
	try {
		const { cardId } = req.body
		const resp = await Card.deleteOne({ cardId: cardId })
		if (resp.deletedCount) {
			return res.status(200).send("Successfully deleted")
		} else {
			res.status(400).send("Error accuring")
		}
	} catch (err) {
		return next(err);
	}
}

const createPayment = async (req, res, next) => {
	try {
		const { token, amount, cardDetails } = req.body;
		const user = await User.findOne({ _id: req.userId });
		let calcAmount;
		if (user.partner) {
			calcAmount = calculatePartnerOrder(amount)
		} else {
			calcAmount = calculateOrderAmount(amount);
		}
		if (user.unlimitedCredits) return res.status(201).send({status: "Unlimited", message: "You have Unlimited Credits"})
		if (!user) return next(createError(404, 'User not found'));
		if (!calcAmount) return next(createError(400, 'Amount is null'));
		if (cardDetails) {
			if (amount) {
				const exists = await Card.findOne({ cardId: cardDetails.cardId })
				if (exists) {
					await stripe.charges.create(
						{
							amount: calcAmount * 100,
							currency: 'usd',
							customer: exists.customerId,
							description: 'Buying credits',
						},
						async (err, charge) => {
							if (err) {
								res.status(400).send('Your payment was failed');
							} else {
								user.credits += +amount;
								await user.save();

								const transaction = new Transaction({
									userId: req.userId,
									type: true,
									note: 'Buying credits',
									amount,
								});
								await transaction.save();
								res.status(200).send(
									'Your payment was successfully completed'
								);
							}
						}
					);
				} else {
					const customer = await stripe.customers.create({
						source: token.id,
						email: user.email,
						name: user.first,
					});

					const newCard = await new Card({
						brand: cardDetails.cardType,
						customerId: customer.id,
						lastFour: cardDetails.lastFour,
						owner: req.userId,
						cardId: cardDetails.cardId
					})
					await newCard.save()

					await stripe.charges.create(
						{
							amount: calcAmount * 100,
							currency: 'usd',
							customer: customer.id,
							description: 'Buying credits',
						},
						async (err, charge) => {
							if (err) {
								res.status(400).send('Your payment was failed');
							} else {
								user.credits += +amount;
								await user.save();

								const transaction = new Transaction({
									userId: req.userId,
									type: true,
									note: 'Buying credits',
									amount,
								});
								await transaction.save();
								res.status(200).send(
									'Your payment was successfully completed'
								);
							}
						}
					);
				}
			}
		} else {
			const customer = await stripe.customers.create({
				email: user.email,
				name: user.first,
			});
			await stripe.customers.createSource(
				customer.id,
				{ source: token.id },
				async (err, source) => {
					if (err) {
						console.error(err);
						res.status(400).send('Your card was declined');
					} else {
						await stripe.charges.create(
							{
								amount: calcAmount * 100,
								currency: 'usd',
								source: source.id,
								customer: customer.id,
								description: 'Buying credits',
							},
							async (err, charge) => {
								if (err) {
									res.status(400).send('Your payment was failed');
								} else {
									user.credits += +amount;
									await user.save();

									const transaction = new Transaction({
										userId: req.userId,
										type: true,
										note: 'Buying credits',
										amount,
									});
									await transaction.save();
									res.status(200).send(
										'Your payment was successfully completed'
									);
								}
							}
						);
					}
				}
			);
		}
	} catch (e) {
		next(e);
	}
};

module.exports = {
	createPayment,
	deleteCard
};
