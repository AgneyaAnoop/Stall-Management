const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const rfidRoutes = require('./routes/rfid');
const inventoryRoutes = require("./routes/inventory");
const cors = require('cors');

const PORT = process.env.PORT || 3000;
let latestRFID = null;
let lastUpdateTime = null;
let pollingInterval = null;

require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Function to simulate RFID scanning (replace this with your actual RFID reading logic)
function scanRFID() {
  // This is a placeholder. In a real scenario, this would interface with your RFID hardware
  const mockRFID = Math.random().toString(36).substring(7);
  console.log(`New RFID scanned: ${mockRFID}`);
  return mockRFID;
}

// Start polling endpoint
app.get('/api/start-polling', (req, res) => {
  if (!pollingInterval) {
    pollingInterval = setInterval(() => {
      const newRFID = scanRFID();
      latestRFID = newRFID;
      lastUpdateTime = new Date();
    }, 5000); // Poll every 5 seconds (adjust as needed)
    console.log("RFID polling started");
    res.json({ message: 'RFID polling started' });
  } else {
    res.json({ message: 'RFID polling was already active' });
  }
});

// Stop polling endpoint
app.get('/api/stop-polling', (req, res) => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    console.log("RFID polling stopped");
    res.json({ message: 'RFID polling stopped' });
  } else {
    res.json({ message: 'RFID polling was already inactive' });
  }
});

app.get('/api/latest-rfid', (req, res) => {
  if (latestRFID && lastUpdateTime) {
    res.json({ rfid: latestRFID, timestamp: lastUpdateTime });
  } else {
    res.json({ message: 'No RFID scanned yet' });
  }
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use('/api', rfidRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});