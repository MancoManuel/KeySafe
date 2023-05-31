var mongoose = require('mongoose');

var password = new mongoose.Schema({
    accountName: {
        type: String,
        required: true
    },
    password: {
        type: Object,
        required: true
    },
    userID: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('password', password);