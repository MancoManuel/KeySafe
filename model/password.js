var mongoose = require('mongoose');

var password = new mongoose.Schema({
    accountName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('password', password);