var bcrypt   = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/userModel.js');

// expose this function to our app using module.exports
module.exports = function (passport) {
    
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
 
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    }, function (req, email, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists

        console.log("local login attempt");

        User.findOne({'email': email }, function (err, user) {
            // if there are any errors, return the error before anything else

            if (err) {
                return done(err);
            }

            if(!bcrypt.compareSync(password, user.password)){ 
                return done(null, false, {message: 'Invalid email or password.'}); 
            }

            if (!user || user == null) {
                return done(null, false, {message: 'Invalid email or password.'});
            }

            // all is well, return successful user
            return done(null, user);
        });
    }));
};

// Login Required middleware.
module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).json({message : 'You must be authenticated to access this data'});
};

// Authorization Required middleware.
module.exports.isAuthorized = (req, res, next) => {
    var provider = req.path.split('/').slice( - 1)[0];
    if (_.find(req.user.tokens, { kind: provider })) {
        next();
    } else {
        res.status(403).json({message : 'You are not authorized to access this data'});
    }
};