const express = require('express');
const { getUser, updateUser, getCards, disableFirstLogin } = require('../controllers/userController');
const router = express.Router();
router.get('/', getUser);
router.post('/update', updateUser);
router.get('/cards', getCards);
router.get('/disableFirstLogin', disableFirstLogin);
module.exports = router;
