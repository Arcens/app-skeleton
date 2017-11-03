'use strict';

var nunjucksRender = require('gulp-nunjucks-api');
var gulp = require('gulp');
var data = require('gulp-data');
var rename = require('gulp-rename');
var path = require('path');
var fs = require('fs');
var persistedFileList = null;
var routePersistedList = null;


function templating(criteria, fileName, srcDirectory, destDirectory, model) {
    var filePath = '';
    console.log('add file back-end', filePath);

    gulp.src(srcDirectory)
        .pipe(data(function () {
            console.log("add the data back-end", criteria);
            return criteria;
        })).pipe(nunjucksRender()).pipe(rename(function (path) {
        path.extname = ".js";
    })).pipe(rename(function (path) {
        console.log('rename :) path', path);
        if (fileName.indexOf('_entity') !== -1) {
            var pathWithOutFileName = '';
            var basename = fileName.replace('_entity', model.name).replace('.js', '');
            console.log('templating route', path);
            path.dirname = pathWithOutFileName;
            path.basename = basename;
        }
    })).pipe(gulp.dest(destDirectory));
}

function appTemplating(config) {
    var appPath = path.join(__dirname, 'template_module_server', 'app.js');
    var destPath = './.temp/server';
    var criteria = {config: config, routeServiceList: routePersistedList};
    templating(criteria, appPath, appPath, destPath);
}

function routeTemplating(config, model) {
    var fileName = '_entityRoute.js';
    var routeTemplating = path.join(__dirname, 'template_module_server', 'routes', fileName);
    var desPath = './.temp/server/routes';
    routePersistedList.push({
        path: 'routes',
        routeFileName: model.name + 'Route.js',
        routeName: model.name + 'Route',
        moduleName: model.name
    });
    var criteria = {config: config, moduleName: model.name};
    templating(criteria, fileName, routeTemplating, desPath, model);
}

function controllerTemplating(config, model) {
    var fileName = '_entityController.js';
    var routeTemplating = path.join(__dirname, 'template_module_server', 'controllers', fileName);
    var desPath = './.temp/server/controllers';
    var criteria = {config: config, moduleName: model.name, className: model.name.capitalize()};
    templating(criteria, fileName, routeTemplating, desPath, model);
}

function modelTemplating(config, model) {
    var fileName = '_entityModel.js';
    var routeTemplating = path.join(__dirname, 'template_module_server', 'models', fileName);
    var desPath = './.temp/server/models';
    var properiesList = [];

    for (var index in model.properties) {
        if (model.properties.hasOwnProperty(index)) {
            if (!model.properties[index].id) {
                model.properties[index].type = model.properties[index].type.capitalize();
                properiesList.push(model.properties[index]);
            }
        }
    }
    var criteria = {config: config, className: model.name.capitalize(), properties: properiesList};
    templating(criteria, fileName, routeTemplating, desPath, model);
}

function createModuleServerNode(model, file, config) {
    // templating the app, inject the websocket and the rest service
    routeTemplating(config, model);
    controllerTemplating(config, model);
    modelTemplating(config, model);
}


exports.init = function () {
    persistedFileList = [];
    routePersistedList = [];
    gulp.src([path.join(__dirname, 'architecture_application/**/*')]).pipe(gulp.dest('./.temp/'));
};

exports.end = function (config) {
    appTemplating(config, routePersistedList);
};

exports.createModuleServer = createModuleServerNode;