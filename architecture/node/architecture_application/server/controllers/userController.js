'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.all = function (req, res) {
    console.log('Get all User');
    User.find({},function(err, user){
        if(err){
            console.log(err);
            res.status(500).json(err);
        }
        res.json(user);
    });
};

exports.findById = function (req, res) {
    console.log('Get User by Id');
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
            res.status(500).json(err);
        }
        console.log('User returned');
        res.json(user);
    });

};

exports.count = function (req, res) {
    console.log('Count User');
    User.find({}, function(err, user){
        if(err){
            console.log(err);
            res.status(500).json(err);
        }
        res.json({count: user.length})
    });
};

exports.remove = function (req, res) {
    console.log('Remove User by Id');

    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.status(500).json(err);
        }
        console.log('User deleted');
        res.status(200);
    });
};

exports.update = function (req, res) {
    console.log('Update User');
    User.findOneAndUpdate({ _id : req.params.id }, req.body, function(err, user) {
        if(err){
            console.log(err);
            res.status(500).json(err);
        }

        console.log('user updated');
        res.json(user);
    });
};

exports.create = function (req, res) {
    console.log('Create User');
    User.create(req.body,function(err, user){
        if(err){
            console.log(err);
            res.status(500).json(err);
        }
        console.log('user created');
        res.json(user);
    });
};