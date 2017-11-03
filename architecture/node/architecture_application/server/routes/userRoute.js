'use strict';

var express = require('express');
var router = express.Router();

var AuthCtrl = require('../controllers/authenticationController.js');
var AccCtrl = require('../controllers/accountController.js');
var userCtrl = require('../controllers/userController.js');

router.post('/login', AuthCtrl.PostLoginAuth);

router.post('/logout', AuthCtrl.PostLogout);

router.post('/signup', AccCtrl.PostSignup);

//router.get('/all', AccCtrl.all);

//router.post('/create', userCtrl.create);

// router.post('/account/profile', AuthCtrl.postUpdatePassword);

// router.post('/account/password', AuthCtrl.postUpdatePassword);

// router.post('/account/delete', AuthCtrl.postDeleteAccount);

// router.put('/:id', AuthCtrl.update);

// router.delete('/:id', AuthCtrl.remove);

module.exports = router;