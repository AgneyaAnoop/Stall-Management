const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userName : {
        type: String,
        required: true,
        unique: true
    },
    RFID : {
        type: String,
        required: true,
        unique: true
    },
    Balance : {
        type: Number,
        default: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", UserSchema);