const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        allow: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{ type: String }]
})

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;