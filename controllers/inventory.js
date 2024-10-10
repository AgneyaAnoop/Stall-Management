const Inventory = require('../models/Inventory');

// Create a new inventory item
exports.createInventory = async (req, res) => {
    const { name, price, stock } = req.body;
    try {
        if (!name || !price || !stock) {
            return res.status(400).json({ error: "name, price and stock are required" });
        }
        if (await Inventory.findOne({ name })) {
            return res.status(400).json({ error: "name already exists" });
        }
        const inventory = new Inventory({ name, price, stock });
        await inventory.save();
        // Return the new inventory item
        res.status(201).json(inventory);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteInventory = async (req, res) => {
    const { id } = req.params;
    try {
        const inventory = await Inventory.findById(id);
        if (!inventory) {
            return res.status(404).json({ error: "Inventory item not found" });
        }
        await inventory.remove();
        res.json({ message: "Inventory item deleted" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}