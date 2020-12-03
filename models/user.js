const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

//USER SCHEMA
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, default: 'seller', enum: ["seller", "admin"] }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
