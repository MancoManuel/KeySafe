var mongoose = require('mongoose');

var password = new mongoose.Schema({
    service: {
        type: String,
        required: true
    },
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