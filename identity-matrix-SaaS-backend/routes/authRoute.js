const {
	login,
	register,
	logout,
	requestPasswordReset,
	verifyEmail,
	resendValidationEmail
} = require('../controllers/authController');
const express = require('express');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/requestResetPassword', requestPasswordReset);
router.get('/verifyEmail/:token', verifyEmail);
router.post('/resendValidationEmail', resendValidationEmail);

module.exports = router;
