var mongoose = require('mongoose');

var account = new mongoose.Schema({
    profileID: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    key: {
        type: Object,
        required: false
    }
});

module.exports = mongoose.model('account', account);