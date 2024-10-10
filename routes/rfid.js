const express = require('express');
const router = express.Router();
const rfidController = require('../controllers/rfid');

router.get('/rfid/:rfidCode', rfidController.postRfid);
router.get('/latest-rfid', rfidController.getLatestRfid);
router.delete('/rfid', rfidController.deleteRfid);

module.exports = router;