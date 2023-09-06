const express = require('express');
const { getLists } = require('../controllers/listController');

const router = express.Router();


router.get('/', getLists);

module.exports = router;
