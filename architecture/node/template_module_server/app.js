'use strict';

var express = require('express');
var chalk = require('chalk');
var path = require('path');
var winston = require('winston');
var mongoose = require('mongoose');
var morgan   = require('morgan');
var expressValidator = require('express-validator');
var passport = require('passport');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local').Strategy;
var session  = require('express-session');

var modelsDir = fs.readdirSync(path.join(__dirname, './models'));


// > Create Express Server
var app = express();

// > MongoDB Configuration
var options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    user: '{{config.mongo.user}}',
    pass: '{{config.mongo.password}}'
}
mongoose.connect('mongodb://{{config.mongo.host}}:{{config.mongo.port}}/{{config.mongo.database}}', options);
mongoose.connection.on('connected', () => {
  console.log('%s MongoDB connection established!', chalk.green('✓'));
});
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});


modelsDir.forEach(function (file) {
    if (file.indexOf('.js') > -1) {
        require('./models/' + file);
    }
});

app.use(expressValidator());

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if({{config.module.isSocket}}){
    {% for socketService in socketServiceList %}
    var socketService = require(path.join(process.cwd(), 'server/service', '{{socketService}}'));
    socketService.lightSubscription();
   {% endfor %}
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// > Passport Configuration
app.use(session({     
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport')(passport);

// > Routes
{% for routeService in routeServiceList %}
var {{routeService.routeName}} = require(path.join(process.cwd(), '{{routeService.path}}', '{{routeService.routeFileName}}'));
app.use('/api/{{routeService.moduleName}}',{{routeService.routeName}});
{% endfor %}
var userRoute = require(path.join(process.cwd(), 'routes', 'userRoute.js'));
app.use('/api/user',userRoute);


// > Express configuration.
app.set('port', 3000);
app.set('views', process.cwd() + '../client/public');
app.set('view engine', 'html');
app.use(express.static(path.join(process.cwd(), '../client/bower_components')));
app.use(express.static(path.join(process.cwd(), '../client/public')));
app.use(express.static(path.join(process.cwd(), 'config')));


app.get('/', function (req, res) {
    res.render('../client/public/index.html');
});

// > Start Express server.
app.listen(app.get('port'), () => {
  console.log('%s Express server listening on port %d', chalk.green('✓'), app.get('port'));
});