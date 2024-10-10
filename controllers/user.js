const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Purchase = require('../models/Purchase');
const mongoose = require('mongoose');

// Create a new user
exports.createUser = async (req, res) => {
    const { userName, RFID} = req.body;
  try {
    if (!userName || !RFID) {
      return res.status(400).json({ error: "userName and RFID are required" });
    }
    if (await User .findOne({ userName })) {
      return res.status(400).json({ error: "userName already exists" });
    }
    if (await User .findOne({ RFID })) {
      return res.status(400).json({ error: "RFID already exists" });
    }
    const user = new User({ userName, RFID });
    await user.save();
    // Return the new user
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get al users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get user by RFID
exports.getUserByRFID = async (req, res) => {
    const { RFID } = req.params;
    try {
        const
        user = await User.findOne({
            RFID
        });
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

exports.addBalance = async (req, res) => {
    const { userName, amount } = req.body;
    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.Balance += amount;
        await user.save();
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}
//Purchase
exports.getRFID = async (req, res) => {
    const { RFID } = req.params;
    return res.status(200).json({ RFID });

};
exports.purchase = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { RFID, items } = req.body;

        const user = await User.findOne({ RFID }).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "User not found" });
        }

        let totalCost = 0;
        const itemUpdates = [];

        // Calculate total cost and check stock
        for (const { inventory_id, quantity } of items) {
            const item = await Inventory.findById(inventory_id).session(session);
            if (!item) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ error: `Item with id ${inventory_id} not found` });
            }
            if (item.stock < quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ error: `Not enough stock for item ${item.name}` });
            }
            totalCost += item.price * quantity;
            itemUpdates.push({ item, quantity });
        }

        // Check user balance
        if (user.Balance < totalCost) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: "Not enough balance" });
        }

        // Process the purchase
        user.Balance -= totalCost;
        await user.save({ session });

        // Update inventory
        for (const { item, quantity } of itemUpdates) {
            item.stock -= quantity;
            await item.save({ session });
        }

        // Create a purchase record
        const purchase = new Purchase({
            user: user._id,
            items: items.map(item => ({
                inventory: item.inventory_id,
                quantity: item.quantity,
                priceAtPurchase: itemUpdates.find(update => update.item._id.toString() === item.inventory_id).item.price
            })),
            totalAmount: totalCost
        });
        await purchase.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ 
            message: "Purchase successful", 
            totalAmount: totalCost,
            newBalance: user.Balance
        });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Purchase error:", error);
        if (error.name === 'VersionError') {
            return res.status(409).json({ error: "Concurrent modification detected. Please try again." });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

