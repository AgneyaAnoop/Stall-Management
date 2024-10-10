const express = require('express');
const router = express.Router();

const inventoryController = require('../controllers/inventory');

// Create Inventory
router.post('/createInventory', inventoryController.createInventory);

// Get Inventory
router.get('/', inventoryController.getInventory);

// Delete Inventory
router.delete('/:id', inventoryController.deleteInventory);

module.exports = router;