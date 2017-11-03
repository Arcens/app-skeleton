var gulp = require('gulp');
var fs = require('fs');
var nunjucksRender = require('gulp-nunjucks-api');
var data = require('gulp-data');
var rename = require('gulp-rename');
var path = require('path');
var mkdirp = require('mkdirp');
var install = require('gulp-install');
//var lodash = require('lodash');

var fileList = [];

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * Retourne l'arborescence d'un dossier
 * @param dir
 * @returns {*}
 */
function getFileStructure(dir) {
    return fs.readdirSync(dir);
}

/**
 * Tâche gulp qui permet d'initialiser le dossier .temp
 * @param dir
 */
gulp.task('initWorkspace', function () {
    console.log('préparation du repertoire de travail');
    gulp.src(['architecture_application/**/*']).pipe(gulp.dest('.temp/'));
    //hack pour copier le bowerrc dans le dossier temp
    gulp.src(['architecture_application/client/.bowerrc']).pipe(gulp.dest('.temp/client/'));
    console.log('preparation terminée');
});

/**
 * Permet de supprimer un dossier
 * @param dir
 */
var rmdir = function (dir) {
    var list = fs.readdirSync(dir);
    for (var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);

        if (filename == "." || filename == "..") {
            // pass these files
        } else if (stat.isDirectory()) {
            // rmdir recursively
            rmdir(filename);
        } else {
            // rm fiilename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
};


/**
 * moteur de template pour les fichiers JS
 */
function templatingJS(fileName, moduleName, srcDirectory, destDirectory, configModel, objectProperties) {
    console.log(objectProperties);
    // console.log("copy and template the ", fileName);
    var baseDir = srcDirectory.replace('template_module', '').replace('_entity', moduleName);
    var filePath = path.join('module', moduleName, baseDir);
    // console.log('add file', filePath);
    fileList.push(filePath);
    gulp.src(srcDirectory)
        .pipe(data(function () {
            
            var propertiesList = [];
            var idAttributeName = "";
            for (var index in objectProperties) {

                if (objectProperties.hasOwnProperty(index)) {

                    if (objectProperties[index].id) {
                        idAttributeName = objectProperties[index].name;
                        if (objectProperties[index].display) {
                            objectProperties[index].name = index;
                            propertiesList.push(objectProperties[index]);
                        }
                    } else {
                        if (objectProperties[index].display_name) {
                            objectProperties[index].display_name = objectProperties[index].display_name;
                        } else {
                            objectProperties[index].display_name = index.replace('_', ' ');
                        }

                        objectProperties[index].name = index;
                        propertiesList.push(objectProperties[index]);
                    }
                }
            }
            
            var object = {moduleName: moduleName, className: moduleName.capitalize(), config: configModel, properties: propertiesList, idAttributeName: idAttributeName};
            // console.log("add the data ", object);
            return object;
        })).pipe(nunjucksRender()).pipe(rename(function (path) {
        path.extname = ".js";
    })).pipe(rename(function (path) {
        var pathWithOutTemplateModule = srcDirectory.replace('template_module', '');
        var pathWithOutFileName = pathWithOutTemplateModule.replace(fileName, '');
        var basename = fileName.replace('_entity', moduleName).replace('.js', '');

        path.dirname += pathWithOutFileName;
        path.basename = basename;
    })).pipe(gulp.dest(destDirectory));
};

/**
 * moteur de template pour les fichiers HTML
 */
function templatingHTML(fileName, moduleName, srcDirectory, destDirectory, configModel, objectProperties) {
    var envObject = {
        tags: { variableStart: '<$', variableEnd: '$>' }
    };
    gulp.src(srcDirectory).pipe(data(function () {
        var propertiesList = [];
        var idAttributeName = "";
        for (var index in objectProperties) {

            if (objectProperties.hasOwnProperty(index)) {

                if (objectProperties[index].id) {
                    idAttributeName = objectProperties[index].name;
                    if (objectProperties[index].display) {
                        objectProperties[index].name = index;
                        propertiesList.push(objectProperties[index]);
                    }
                } else {
                    if (objectProperties[index].display_name) {
                        objectProperties[index].display_name = objectProperties[index].display_name;
                    } else {
                        objectProperties[index].display_name = index.replace('_', ' ');
                    }

                    objectProperties[index].name = index;
                    propertiesList.push(objectProperties[index]);
                }
            }
        }
		
        var object = {moduleName: moduleName, properties: propertiesList, config: configModel, idAttributeName: idAttributeName};
        return object;
    })).pipe(nunjucksRender(envObject)).pipe(rename(function (path) {
            path.extname = ".html";
        }))
        .pipe(rename(function (path) {
            var pathWithOutTemplateModule = srcDirectory.replace('template_module', '');
            var pathWithOutFileName = pathWithOutTemplateModule.replace(fileName, '');
            var basename = fileName.replace('_entity', moduleName).replace('.html', '');

            path.dirname += pathWithOutFileName;
            path.basename = basename;

        })).pipe(gulp.dest(destDirectory));
};


/**
 * Méthode appelée par createModule pour renommer les fichiers selon le modèle du module
 * @param folderName
 * @param moduleName
 */
function copyAndTemplatingProcess(folderName, moduleName, configModel, objectProperties) {
    var files = getFileStructure(folderName);
    for (var i in files) {
        var file = files[i];
        if (file !== '.DS_Store') {
            if (fs.statSync(path.join(folderName, file)).isDirectory()) {
                if (moduleName) {
                    gulp.src(path.join(folderName, file)).pipe(gulp.dest(path.join('.temp', 'client', 'public', 'module', moduleName)));
                    copyAndTemplatingProcess(path.join(folderName, file), moduleName, configModel, objectProperties);
                }
            } else {
                nunjucksRender.nunjucks.configure(['template_module'], {watch: false});
                var fileName = path.basename(path.join(folderName, file));
                // console.log('fileNammmmeeee', fileName);
                if (fileName.indexOf('_entity') !== -1) {
                    if (fileName.indexOf('.js') !== -1) {
                        templatingJS(fileName, moduleName, path.join(folderName, file), '.temp/client/public/module/' + moduleName + '/', configModel, objectProperties);
                    }
                    if (fileName.indexOf('.html') !== -1) {
                        templatingHTML(fileName, moduleName, path.join(folderName, file), '.temp/client/public/module/' + moduleName + '/', configModel, objectProperties);
                    }
                }
                if ((fileName === "config.js" || fileName === 'app.js') && folderName === 'template_application_FE') {
                    nunjucksRender.nunjucks.configure(['template_application_FE/'], {watch: false});
                    // console.log('configggg', folderName + file);
                    // console.log(configModel);
                    gulp.src(path.join(folderName, file)).pipe(data(function () {
                        // console.log(configModel);
                        return configModel
                    })).pipe(nunjucksRender()).pipe(rename(function (path) {
                        path.extname = ".js";
                    })).pipe(gulp.dest('.temp/client/public/'))
                }
            }
        }
    }
    // console.log('index injection process', fileList);
}

/**
 * Méthode qui créer un module F-E
 * @param moduleName
 */
function createModule(moduleName, appConfigModel, objectProperties) {
    copyAndTemplatingProcess('template_module', moduleName, appConfigModel, objectProperties);
}

/**
 *  fonction principale qui créer le front-end en module et appelle le générateur du back-end à chaque module
 * @param backEndModule
 */
function main(backEndModule) {
    var backEndProcess = null;
    switch (backEndModule) {
        case "loopback":
            backEndProcess = require('./architecture/loopback/loopBack.js');
            break;
        case "node":
            backEndProcess = require('./architecture/node/node.js');
            break;
        case "angularjs":
            break;
		case "nancy":
            backEndProcess = require('./architecture/nancy/nancy.js');
            break;
        default:
            break;
    }
    try {
        rmdir('.temp');
    } catch (e) {
        console.log('no .temp directory ');
    }
	
	var appModelConfigString = fs.readFileSync('config.json');
    var appModelConfigJSON = JSON.parse(appModelConfigString);
	
    mkdirp.sync('.temp');
    mkdirp.sync('.temp/client');
    mkdirp.sync('.temp/common/models');
    mkdirp.sync('.temp/server');
    
	if (backEndProcess) {
        backEndProcess.init(appModelConfigJSON);
    }

    console.log('appModelConfigString', appModelConfigJSON);
    nunjucksRender.nunjucks.configure(['template_module_server/service'], {watch: false});
    //on copy le template dans .temp
    gulp.run('initWorkspace');
    copyAndTemplatingProcess("template_application_FE", undefined, appModelConfigJSON);
    // on boucle sur l'ensemble des modèles pour créer la partie front end et back-end
    var files = getFileStructure("model");
    var modelNameList = [];
    for (var index in files) {
        var file = files[index];
        var stringContent = fs.readFileSync(path.join(__dirname, "model", file));
        var model = JSON.parse(stringContent);
        console.log(model);
        modelNameList.push(model.name);
        // création des modules coté client
        createModule(model.name, appModelConfigJSON, model.properties);
        // création des modules coté serveur
        if (backEndProcess) {
            backEndProcess.createModuleServer(model, file, appModelConfigJSON);
        }
    }

    if (backEndProcess) {
        backEndProcess.end(appModelConfigJSON);
    }
    nunjucksRender.nunjucks.configure(['template_application_FE'], {watch: false});
    // injection des fichiers JavaScript générés dans l'index.html
    gulp.src('template_application_FE/index.html').pipe(data(function () {
        var object = {filesToInjectIndex: fileList.reverse(), config: appModelConfigJSON};
        return object;
    })).pipe(nunjucksRender()).pipe(rename(function (path) {
        path.extname = ".html";
    })).pipe(gulp.dest('.temp/client/public/'));

    //génération du layout de l'application avec le menu
    var envObject = {
        tags: {
            variableStart: '<$',
            variableEnd: '$>'
        }
    };
    gulp.src(path.join('template_application_FE', 'app-layout.html')).pipe(data(function () {
        var object = {properties: modelNameList};
        return object;
    })).pipe(nunjucksRender(envObject)).pipe(rename(function (path) {
            path.extname = ".html";
        }))
        .pipe(rename(function (path) {
            path.dirname += "/layout/view";
            path.extname = ".html"
        })).pipe(gulp.dest('.temp/client/public/module/'));
    // injecte la pahe home de l'application
    gulp.src(path.join('template_application_FE', 'home.html')).pipe(data(function () {

        var object = {properties: modelNameList};
        return object;
    })).pipe(nunjucksRender(envObject)).pipe(rename(function (path) {
            path.extname = ".html";
        }))
        .pipe(rename(function (path) {
            path.dirname += "/layout/view";
            path.extname = ".html"
        })).pipe(gulp.dest('.temp/client/public/module/'));
    gulp.src('.temp/client/bower.json').pipe(install());
}


/**
 * Tâche SWAT qui permet de générer un projet à partir d'un modèle avec le framework loopback
 */
gulp.task('swat-loopback', function () {
	main('loopback');
});

/**
 * Tâche SWAT qui permet de générer un projet à partir d'un modèle avec nodeJS & mongo
 */
gulp.task('swat-node', function () {
	main('node');
});

/**
 * Tâche SWAT qui permet de générer que le front-end à partir d'un modèle
 */
gulp.task('swat-angularjs', function () {
    main('angularjs');
});

/**
 * Tâche SWAT qui permet de générer que le front-end à partir d'un modèle
 */
gulp.task('swat-nancy', function () {
    main('nancy');
});
