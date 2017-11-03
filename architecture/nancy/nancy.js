/**
 * Created by T.HENRY on 03/08/2016
 */
'use strict';

var gulp = require('gulp');
var fs = require('fs');
var nunjucksRender = require('gulp-nunjucks-api');
var data = require('gulp-data');
var rename = require('gulp-rename');
var path = require('path');
var mkdirp = require('mkdirp');
var install = require("gulp-install");

var modulesList = [];
var controllersList = [];
var modelsList = [];

function templating(criteria, fileName, srcDirectory, destDirectory, model, ext) {
    var filePath = '';

    gulp.src(srcDirectory)
        .pipe(data(function () {
            return criteria;
        }))
        .pipe(nunjucksRender())                           
        .pipe(rename(function (path) {
            path.extname = ext;
        }))
        .pipe(rename(function (path) {

            if (fileName.indexOf('_entity') !== -1) {
                var pathWithOutFileName = '';
                var basename = fileName.replace('_entity', model.name.capitalize()).replace(ext, '');
                path.dirname = pathWithOutFileName;
                path.basename = basename;
            }

            if (fileName.indexOf('_appName') !== -1) {
                var pathWithOutFileName = '';
                var basename = fileName.replace('_appName', criteria.AppName).replace(ext, '');
                path.dirname = pathWithOutFileName;
                path.basename = basename;
            }
        }))
        .pipe(gulp.dest(destDirectory));
}

function appConfigTemplate(config) {
    var criteria = { AppName: config.appName, Host: config.serverUrl, Port: config.serverPort, DB: config.sqlserver };
    var fileName = 'App.config';
    var sourcePath = path.join(__dirname, 'template_module_server', fileName);
    var desPath = './.temp/server/' + config.appName;

    templating(criteria, fileName, sourcePath, desPath, {}, '.config');
}

function slnTemplate(config) {
    var criteria = { AppName: config.appName };
    var fileName = '_appName.sln';
    var sourcePath = path.join(__dirname, 'template_module_server', fileName);
    var desPath = './.temp/server/';

    templating(criteria, fileName, sourcePath, desPath, {}, '.sln');
}

function csprojTemplating(config) {
    var criteria = { AppName: config.appName, controllersList: controllersList, modelsList: modelsList, modulesList: modulesList };
    var fileName = '_appName.csproj';
    var sourcePath = path.join(__dirname, 'template_module_server', fileName);
    var desPath = './.temp/server/' + config.appName;

    templating(criteria, fileName, sourcePath, desPath, {}, '.csproj');
}

function assemblyInfoTemplating(config) {
    var criteria = { AppName: config.appName };

}

function modelTemplating(config, model) {
    modelsList.push(model.name.capitalize() + 'Model.cs');

    var fileName = '_entityModel.cs';
    var routeTemplating = path.join(__dirname, 'template_module_server', 'model', fileName);
    var desPath = './.temp/server/' + config.appName + '/Models';
    var properiesList = [];

    for (var index in model.properties) {
        if (model.properties.hasOwnProperty(index) &&
            //ignore properties that are in the base class
            (model.properties[index].name != '_id'
                && model.properties[index].name != 'creation_date'
                && model.properties[index].name != 'last_update')
        ) {

            switch (model.properties[index].type) {
                case "number":
                    model.properties[index].type = 'int';
                    break;
                case "boolean":
                    model.properties[index].type = 'bool';
                    break;
                case "date":
                    model.properties[index].type = 'DateTime';
                default:
                    break;
            }

            model.properties[index].type = model.properties[index].type;
            properiesList.push(model.properties[index]);
        }
    }
    var criteria = { config: config, className: model.name.capitalize(), modelName: model.name, properties: properiesList };
    templating(criteria, fileName, routeTemplating, desPath, model, '.cs');
}

function controllerTemplating(config, model) {
    controllersList.push(model.name.capitalize() + 'Controller.cs');

    var fileName = '_entityController.cs';
    var routeTemplating = path.join(__dirname, 'template_module_server', 'controller', fileName);
    var desPath = './.temp/server/' + config.appName + '/Controllers';

    var criteria = { config: config, className: model.name.capitalize(), moduleName: model.name };
    templating(criteria, fileName, routeTemplating, desPath, model, '.cs');
}

function moduleTemplating(config, model) {
    modulesList.push(model.name.capitalize() + 'Module.cs');

    var fileName = '_entityModule.cs';
    var routeTemplating = path.join(__dirname, 'template_module_server', 'module', fileName);
    var desPath = './.temp/server/' + config.appName + '/Modules';

    var criteria = { config: config, className: model.name.capitalize(), moduleName: model.name };
    templating(criteria, fileName, routeTemplating, desPath, model, '.cs');
}

/// These files don't need to be completely regenerated for the project
/// We only inject some parts (Mainly the project name)
function otherfilesTemplating(config) {
    // Base Module
    var criteria = { AppName: config.appName };
    var fileName = 'BaseModule.cs';
    var sourcePath = path.join(__dirname, 'template_module_server', 'module', fileName);
    var desPath = './.temp/server/' + config.appName + '/Modules/';

    templating(criteria, fileName, sourcePath, desPath, {}, '.cs');

    // Auth Module
    var fileName = 'AuthModule.cs';
    var sourcePath = path.join(__dirname, 'template_module_server', 'module', fileName);
    var desPath = './.temp/server/' + config.appName + '/Modules/';

    templating(criteria, fileName, sourcePath, desPath, {}, '.cs');

    // Helpers
    var fileName = 'Helper.cs';
    var sourcePath = path.join(__dirname, 'template_module_server', 'helper', fileName);
    var desPath = './.temp/server/' + config.appName + '/Helpers/';

    templating(criteria, fileName, sourcePath, desPath, {}, '.cs');

    // - AuthHelper
    var fileName = 'AuthHelper.cs';
    var sourcePath = path.join(__dirname, 'template_module_server', 'helper', fileName);
    var desPath = './.temp/server/' + config.appName + '/Helpers/';

    templating(criteria, fileName, sourcePath, desPath, {}, '.cs');

    //Controllers
    var fileName = 'UserController.cs';
    var sourcePath = path.join(__dirname, 'template_module_server', 'controller', fileName);
    var desPath = './.temp/server/' + config.appName + '/Controllers/';

    templating(criteria, fileName, sourcePath, desPath, {}, '.cs');

    // Interface
    var fileName = 'ISWAT.cs';
    var sourcePath = path.join(__dirname, 'template_module_server', 'interface', fileName);
    var desPath = './.temp/server/' + config.appName + '/Interfaces/';

    templating(criteria, fileName, sourcePath, desPath, {}, '.cs');


    // Bootstrapper
    var fileName = 'Bootstrapper.cs';
    var sourcePath = path.join(__dirname, 'template_module_server', fileName);
    var desPath = './.temp/server/' + config.appName;

    templating(criteria, fileName, sourcePath, desPath, {}, '.cs');

    // Index Module
    var fileName = 'IndexModule.cs';
    var sourcePath = path.join(__dirname, 'template_module_server', fileName);
    var desPath = './.temp/server/' + config.appName;

    templating(criteria, fileName, sourcePath, desPath, {}, '.cs');

    // Program
    var fileName = 'Program.cs';
    var sourcePath = path.join(__dirname, 'template_module_server', fileName);
    var desPath = './.temp/server/' + config.appName;

    templating(criteria, fileName, sourcePath, desPath, {}, '.cs');

    // BaseModel
    var fileName = 'BaseModel.cs';
    var sourcePath = path.join(__dirname, 'template_module_server', 'model', fileName);
    var desPath = './.temp/server/' + config.appName + '/Models/';

    templating(criteria, fileName, sourcePath, desPath, {}, '.cs');

    // User Model
    var fileName = 'UserModel.cs';
    var sourcePath = path.join(__dirname, 'template_module_server', 'model', fileName);
    var desPath = './.temp/server/' + config.appName + '/Models/';

    templating(criteria, fileName, sourcePath, desPath, {}, '.cs');

    // AssemblyInfo
    var fileName = 'AssemblyInfo.cs';
    var sourcePath = path.join(__dirname, 'template_module_server', fileName);
    var desPath = './.temp/server/' + config.appName + '/properties/';

    templating(criteria, fileName, sourcePath, desPath, {}, '.cs');
}

function createModuleServerNancy(model, file, config) {
    modelTemplating(config, model);
    controllerTemplating(config, model);
    moduleTemplating(config, model);
}

exports.init = function (config) {
    mkdirp.sync('.temp/server/' + config.appName);
    appConfigTemplate(config);
    slnTemplate(config);
    // assemblyInfoTemplating(config); 
    // baseModelTemplating(config);

    gulp.src([path.join(__dirname, 'architecture_application/**/*')]).pipe(gulp.dest('./.temp/server/' + config.appName));
};

exports.end = function (config) {
    // on injecte la config complète coté server
    csprojTemplating(config);
    otherfilesTemplating(config);
};

exports.createModuleServer = createModuleServerNancy;