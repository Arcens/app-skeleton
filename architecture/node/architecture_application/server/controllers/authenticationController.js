'use strict';

var passport = require('passport');

module.exports.PostLoginAuth = function (req, res, next) {
    
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
    
    var errors = req.validationErrors();

    if (errors) {
        return res.status(403).json(errors);
    }

    passport.authenticate('local-login', function (err, user, info) {
        req.logIn(user, function (err) {
            if (err || !user) {
                return res.status(403).json(err);
            }
            
            return res.status(200).json(user);
        });
    })(req, res, next);
};

module.exports.PostLogout = function (req, res, next) {
    req.logOut();
    delete req.session.historyData;
    return res.status(200).json({message : 'user logged out'});
};