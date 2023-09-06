const express = require('express');
const router = express.Router();

const multer = require('multer');
const { uploadData, getData, downloadBlob, getSingleData, getSingleDatas } = require('../controllers/dataController');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('csv'), uploadData);
router.post('/getSingleData', getSingleData)
router.get('/getSingleDatas', getSingleDatas)
router.get('/:id', getData);
router.post('/downloadBlob', downloadBlob);

module.exports = router;