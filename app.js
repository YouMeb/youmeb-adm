
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var parser = require('rssparser'); 
var Sequelize = require('sequelize'); 
var sequelize = new Sequelize('mysql://blue:F2muHUTrAyastusu@54.214.246.94:3306/meet', {
  // Look to the next section for possible options
});
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
    }

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};
var News = sequelize.define('news', {
  id: Sequelize.STRING,
  name: Sequelize.STRING,
  author: Sequelize.STRING,
  post_date: Sequelize.DATE,
  image_uri: Sequelize.STRING,
  tag: Sequelize.TEXT,
  content: Sequelize.TEXT,
  status: Sequelize.STRING,
  is_rss: Sequelize.STRING,
  creator: Sequelize.STRING,
  modifier: Sequelize.STRING,
  modify_date: Sequelize.DATE,
  views: Sequelize.INTEGER  
})

var _ui = 0;
// expecting something close to 500
setTimeout(function(){ 
  var getday = new Date().setHours(12,0,0,0);
  var start = new Date().getTime();
  if(start >= getday){ 
    startparser(); 
  } 
}, 1000);

function startparser(){
    parser.parseURL('http://www.bnext.com.tw/rss/data/venture.rss', {}, function(err, out){
        var _tmp = [];
        var _n = out.items.length - 1;
        var _tmpui = out.items[_n].newsid; 
        if(_tmpui == _ui){

        }else{
            for(var i = 0; i< out.items.length;i++){
              var _t = new Date(out.items[i].published_at).toMysqlFormat();
              News.create({
                      id:out.items[i].newsid,
                      name:out.items[i].title,
                      content:out.items[i].summary,
                      post_date:_t,
                      author:out.items[i].author,
                      is_rss:1,
                      status:1,
                      creator:'rss',
                      image_uri:'default_news_pic200X140.png'
                    }).success(function(e){
                      console.log(e)
              })      
            }
            _ui = _tmpui
        }
        
    });
}



// var sequelize = new Sequelize('database', null, null, {
//   dialect: 'mysql',
//   port: 3306
//   replication: {
//     read: [
//       //{ host: '8.8.8.8', username: 'anotherusernamethanroot', password: 'lolcats!' },
//       { host: '54.214.246.94', username: 'blue', password: 'dietocase@)!#'}
//     ],
//     write: { host: '54.214.246.94', username: 'blue', password: 'dietocase@)!#'}
//   },
//   pool: { // If you want to override the options used for the read pool you can do so here
//     maxConnections: 20,
//     maxIdleTime: 30000
//   },
// })

var app = express();
var config = require(path.join(__dirname, '/', 'config.json'));

app.enable("jsonp callback");

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'assets')));
});


app.configure('development', function(){
  app.use(express.errorHandler());
});

require(path.join(__dirname, 'routes.js'))(app);
require(path.join(__dirname, 'db.js'));
require(path.join(__dirname, 'models', 'index.js'));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
console.log('kerker');
console.log('kerker');

