'use strict';

var path = require('path');
var controllers = require(path.join(__dirname, 'controllers', 'index.js'));
var models = require(path.join(__dirname, 'models', 'index.js'));
var config = require(path.join(__dirname, '/', 'config.json'));

module.exports = function (app) {  
  	app.get('/start', controllers.home.start);
	app.get('/',controllers.home.index)
}
