var express = require('express');
var router = express.Router();

var homeController = require('../routes/home');
var userController = require('../routes/user');
var dataController = require('../routes/data');

router.get('/', function(req, res) {
	console.log("function called");
	res.redirect('/login');
})
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.post('/login', userController.postRegister);
router.get('/data', dataController.getData);
router.get('/data/:dname', dataController.getPDF);

module.exports = router;
