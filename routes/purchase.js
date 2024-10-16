const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase');

router.get('/', purchaseController.getAllPurchases);

module.exports = router;