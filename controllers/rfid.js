const User = require('../models/User');

const rfidController = {
    handleRFID: async (req, res) => {
      const { rfid } = req.body;
  
      if (!rfid) {
        return res.status(400).json({ error: "RFID is required" });
      }
  
      try {
        const user = await User.findOne({ RFID: rfid });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
  
        // Update the latest RFID
        req.setLatestRFID(rfid);
  
        res.status(200).json({ message: "RFID received", user: user });
      } catch (error) {
        console.error("Error handling RFID:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };

module.exports = rfidController;