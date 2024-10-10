// Write basic express app
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const rfidRoutes = require('./routes/rfid');
const inventoryRoutes = require("./routes/inventory");

const PORT = process.env.PORT || 3000;
let latestRFID = null;
let lastUpdateTime = null;



require("dotenv").config();

app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });



  app.get('/api/latest-rfid', (req, res) => {
    if (latestRFID && lastUpdateTime) {
      res.json({ rfid: latestRFID, timestamp: lastUpdateTime });
    } else {
      res.json({ message: 'No RFID scanned yet' });
    }
  });

  app.use((req, res, next) => {
    req.setLatestRFID = (rfid) => {
      latestRFID = rfid;
      lastUpdateTime = new Date();
    };
    next();
  });

// Routes
app.use("/api/user", userRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use('/api', rfidRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);
