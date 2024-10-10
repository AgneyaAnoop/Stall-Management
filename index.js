const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const rfidRoutes = require('./routes/rfid');
const inventoryRoutes = require("./routes/inventory");
const cors = require('cors');

const PORT = process.env.PORT || 3000;


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


// Routes
app.use("/api/user", userRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use('/api', rfidRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});