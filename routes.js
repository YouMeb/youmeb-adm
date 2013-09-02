'use strict';

var path = require('path');
var controllers = require(path.join(__dirname, 'controllers', 'index.js'));
var models = require(path.join(__dirname, 'models', 'index.js'));
var config = require(path.join(__dirname, '/', 'config.json'));

module.exports = function (app) {  
  	app.get('/start', controllers.home.start);
	app.get('/input',controllers.home.input)
	app.get('/getid',controllers.home.radamnumber);
	app.post('/postdata',controllers.home.postdata)
	app.get('/end',controllers.home.end);
	app.get('/say',controllers.home.say);
	app.get('/',controllers.home.index)
	
}
