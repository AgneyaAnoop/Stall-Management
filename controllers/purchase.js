const Purchase = require('../models/Purchase');

//Get all Purchases in decreasing order of purchase date
exports.getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find()
            .sort({ purchaseDate: -1 })
            .populate({
                path: 'user',
                select: 'userName RFID -_id'
            })
            .populate({
                path: 'items.inventory',
                select: 'name price stock -_id'
            });

        // Check if there are no purchases
        if (purchases.length === 0) {
            return res.status(404).json({ error: "No purchases found" });
        }

        // Format the response
        const formattedPurchases = purchases.map(purchase => ({
            id: purchase._id,
            userName: purchase.user.userName,
            userRFID: purchase.user.RFID,
            items: purchase.items.map(item => ({
                name: item.inventory.name,
                quantity: item.quantity,
                priceAtPurchase: item.priceAtPurchase,
                currentPrice: item.inventory.price,
                currentStock: item.inventory.stock
            })),
            totalAmount: purchase.totalAmount,
            purchaseDate: purchase.purchaseDate
        }));

        res.status(200).json({ purchases: formattedPurchases });
    } catch (error) {
        console.error('Error in getAllPurchases:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

