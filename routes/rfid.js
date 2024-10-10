const express = require('express');
const router = express.Router();
const rfidController = require('../controllers/rfid');

router.post('/rfid', rfidController.handleRFID);

module.exports = router;