var mongoose = require('mongoose');

var account = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('account', account);