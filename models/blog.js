const mongoose = require('mongoose');


//PRODUCT SCHEMA
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now },
    cost: String,
    author: {
        id:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

module.exports = mongoose.model("Blog", blogSchema);
