var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var _ = require('lodash');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = User =  mongoose.model('User', userSchema);