'use strict';

var path = require('path');
var controllers = require(path.join(__dirname, 'controllers', 'index.js'));
var models = require(path.join(__dirname, 'models', 'index.js'));
var config = require(path.join(__dirname, '/', 'config.json'));
var csv = require('ya-csv');
var nation = './address.csv';
 var reader = csv.createCsvFileReader(nation, {
            'separator': ',',
            'quote': '"',
            'escape': '"',
            'comment': '',
            'columnsFromHeader': 'true',
});
reader.addListener('data', function(data) {
    if (data) {
        // Nation.create(data, function(err, nation) {
        //     if (err) {
        //         res.json({
        //             code: 'ERR',
        //             msg: 'err' + err
        //         });
        //     };
        //     if (nation) {
        //         nation.save();
        //         res.json({
        //             code: 'OK',
        //             msg: sprintf('success')
        //         });
        //     };
        // })
		console.log(data);
    };
})




module.exports = function (app) {  
  	app.get('/skii/start', controllers.home.start);
	app.get('/skii/input',controllers.home.input)
	app.get('/skii/getid',controllers.home.radamnumber);
	app.post('/skii/postdata',controllers.home.postdata)
	app.get('/skii/end',controllers.home.end);
	app.get('/skii/say',controllers.home.say);
	app.get('/skii/',controllers.home.index);
	app.get('/skii/arround',controllers.home.arround);
	
}
