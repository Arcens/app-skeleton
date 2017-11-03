/**
 * Created by gautruche on 01/08/2016.
 */
'use strict';

var nunjucksRender = require('gulp-nunjucks-api');
var gulp = require('gulp');
var data = require('gulp-data');
var rename = require('gulp-rename');
var path = require('path');
var fs = require('fs');
var serverModelConfig = null;


/**
 * Initialise le modèle du fichier de config pour le server
 * @returns {{_meta: {sources: string[], mixins: string[]}, User: {dataSource: string}, AccessToken: {dataSource: string, public: boolean}, ACL: {dataSource: string, public: boolean}, RoleMapping: {dataSource: string, public: boolean}, Role: {dataSource: string, public: boolean}}}
 */
function initModelConfig() {
    var model = {
        "_meta": {
            "sources": [
                "loopback/common/models",
                "loopback/server/models",
                "../common/models",
                "./models"
            ],
            "mixins": [
                "loopback/common/mixins",
                "loopback/server/mixins",
                "../common/mixins",
                "./mixins"
            ]
        },
        "User": {
            "dataSource": "db"
        },
        "AccessToken": {
            "dataSource": "db",
            "public": false
        },
        "ACL": {
            "dataSource": "db",
            "public": false
        },
        "RoleMapping": {
            "dataSource": "db",
            "public": false
        },
        "Role": {
            "dataSource": "db",
            "public": false
        }
    };

    return model;
}

/**
 * Rajouter un modèle dans la config du server
 * @param model
 * @param modelConfig
 */
function addModelInConfig(model, modelConfig) {
    console.log('create server module' + model.name);
    var object = {};
    object[model.name] = {
        "dataSource": "db",
        "public": true
    };
    modelConfig[model.name] = {
        "dataSource": "db",
        "public": true
    };
}


/**
 * Copie les modèles dans le server
 * @param modelPath
 */
function copyModel(modelPath) {
    console.log('copy ' + modelPath);
    gulp.src(modelPath).pipe(gulp.dest('.temp/common/models/'));
}


/**
 * Copie des service dans le server
 * @param model
 */
function copyService(path, model) {
    console.log('templating process for ' + path);
    return gulp.src(path + '*.js').pipe(data(function () {
        console.log("modelll" + model);
        return model
    })).pipe(nunjucksRender()).pipe(rename(function (path) {
        path.basename = model.name;
        path.extname = ".js";
    })).pipe(gulp.dest('.temp/common/models/'))
}


function createModuleServerLoopBack(model, file) {
    // on injecte les modules dans la config
    addModelInConfig(model, serverModelConfig);
// copy model
    copyModel(path.join('model', file));
//copy service
    copyService(path.join('template_module_server', 'service'), model);
}


/**
 * Créer le fichier de config pour le server
 * @param configModel
 */
function createConfigModel(configModel) {
    console.log(configModel);
    fs.writeFile(".temp/server/model-config.json", JSON.stringify(configModel, null, 4), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was created!");
    });
}

exports.init = function () {
    serverModelConfig = initModelConfig();
    gulp.src([path.join(__dirname,'architecture_application/**/*')]).pipe(gulp.dest('./.temp/'));

};

exports.end = function(){
    // on injecte la config complète  coté server
    createConfigModel(serverModelConfig);
};

exports.createModuleServer = createModuleServerLoopBack;






