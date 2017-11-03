'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var User = mongoose.model('User');

module.exports.PostSignup = function (req, res, next) {
    req.session.historyData = _.omit(req.body, 'password');

    if (!req.body.email) {
        req.session.historyData.message = 'E-mail is required.'
        return res.status(400).json({message: 'E-mail is required.'});
    }

    if (!req.body.password) {
        req.session.historyData.message = 'Password is required.'
        return res.status(400).json({message: 'Password is required.'});
    }

    if (req.body.password !== req.body.password_confirm) {
        req.session.historyData.message = 'Password confirmation should match password.'
        return res.status(400).json({message: 'Password confirmation should match password.'});
    }

    var userData = _.pick(req.body, 'name', 'email', 'password');
    
    userData.password_salt = bcrypt.genSaltSync(8);
    userData.password = bcrypt.hashSync(userData.password, userData.password_salt, null);
    
    User.create(userData, function(err, userData){
        
        console.log(userData);
        
        if (err && (11000 === err.code || 11001 === err.code)) {
            console.log(err);
            req.session.historyData.message = 'E-mail is already in use.'
            return res.status(400).json({message: 'E-mail is already in use.'});
        }
        
        if (err) {
            req.session.historyData.message = 'Something went wrong, please try later.'
            return res.status(500).json({message: 'Something went wrong, please try later.'});
        }
        
        req.logIn(userData, function (err) {
            delete req.session.historyData;
            res.status(200).json(userData);
        });
    });
};