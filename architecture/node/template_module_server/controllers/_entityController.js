'use strict';

var mongoose = require('mongoose');
var {{className}} = mongoose.model('{{className}}');

exports.all = function (req, res) {
    console.log('Get all {{className}}');
    {{className}}.find({},function(err, {{moduleName}}){
        if(err){
            console.log(err);
            res.status(500).json(err);
        }
        res.status(200).json({{moduleName}});
    });
};

exports.findById = function (req, res) {
    console.log('Get {{className}} by Id');
    {{className}}.findById(req.params.id, function(err, {{moduleName}}){
        if(err){
            console.log(err);
            res.status(500).json(err);
        }
        console.log('{{className}} returned');
        res.status(200).json({{moduleName}});
    });

};

exports.count = function (req, res) {
    console.log('Count {{className}}');
    {{className}}.find({}, function(err, {{moduleName}}){
        if(err){
            console.log(err);
            res.status(500).json(err);
        }
        res.status(200).json({count: {{moduleName}}.length})
    });
};

exports.remove = function (req, res) {
    console.log('Remove {{className}} by Id');

    {{className}}.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.status(500).json(err);
        }
        console.log('{{className}} deleted');
        res.status(200).json({message : '{{className}} deleted'});
    });
};

exports.update = function (req, res) {
    console.log('Update {{classname}}');
    {{className}}.findOneAndUpdate({ _id : req.params.id }, req.body, function(err, {{moduleName}}) {
        if(err){
            console.log(err);
            res.status(500).json(err);
        }

        console.log('{{moduleName}} updated');
        res.status(200).json({{moduleName}});
    });
};

exports.create = function (req, res) {
    console.log('Create {{classname}}');
    {{className}}.create(req.body,function(err, {{moduleName}}){
        if(err){
            console.log(err);
            res.status(500).json(err);
        }
        console.log('{{moduleName}} created');
        res.status(200).json({{moduleName}});
    });
};