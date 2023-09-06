const express = require('express');
const createPayment = require('../controllers/paymentController');
const router = express.Router();

router.post('/createPayment', createPayment.createPayment);
router.post('/deleteCard', createPayment.deleteCard)

module.exports = router;
