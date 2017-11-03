'use strict';

var express = require('express');
var router = express.Router();

var {{moduleName}}Controller = require('../controllers/{{moduleName}}Controller.js');

router.get('/:id', {{moduleName}}Controller.findById);

router.get('/', {{moduleName}}Controller.all);

router.get('/count', {{moduleName}}Controller.count);

router.post('/', {{moduleName}}Controller.create);

router.put('/:id', {{moduleName}}Controller.update);

router.delete('/:id', {{moduleName}}Controller.remove);


module.exports = router;