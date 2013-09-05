'use strict';

var config = require('../config');
var models = require('../models/index.js');
var utils = require('../lib/util');
var request = require('request');

// function indexAction(req, res, next) {
//   request('http://listening-api.g0v.tw/api/tags.json', 
//     utils.checkError(next, function (err, _res, body) {
//       var alltag = JSON.parse(body);
//       // err should be null
//       var query = models.synonyms.find({});
//       query.exec(utils.checkError(next, function (err, qresults) {
//         for (var y in qresults){  
//           var tags = {}; tags.tag = {};
//           tags.tag.value_zh = qresults[y].synonyms;
//           tags.tag.value = qresults[y].tags;
//           alltag.push(tags);
//         }
//         var query2 = models.Helpme.find({}).sort({"updatedAt": -1}).limit(3);
//         query2.exec(utils.checkError(next, function (reqq, results) {
//           res.render('index2', {
//             data: results,
//             alltag:alltag,
//             title:config.title,
//           });
//         }));
//       }));
//     }));
// }
function Start(req, res, next) {
  res.render('start');
}
function index(req, res, next){
	res.render('index')
}
function radamnumber(req, res, next){
	(new models.Productid({
		isregist:0
      })).save(function(err,pro){
        res.send({id:pro._id})
    })   
}
function postdata(req, res, next){
	console.log(req)
	models.Productid.update({ '_id': req.body.id},
     {
     	isregist:    1,  
		name:        req.body.name,
		address:     req.body.addr,
		email:       req.body.email,
		uuid:        req.body.uui
     }
     , function (err, numberAffected, raw) {
      res.redirect('/skii/end');
    });
}
function end(req, res, next){
	res.render('end')
}
function say(req, res, next){
	res.render('say');
}
function input(req, res, next){
	res.render('input')
}
function arround(req, res ,next){
  var data = [{
    name:'太平洋崇光百貨(BR4)',
    city:'台北市',
    area:'大安區',
    address:'忠孝東路三段300號2樓'
},{
    name:'京站購物中心',
    city:'台北市',
    area:'大同區',
    address:'承德路1段1號'
},{
    name:'遠東百貨(板橋中山)',
    city:'新北市',
    area:'板橋區',
    address:'中山路1段152號'
}];
  res.render('arround',{data:data});
}
module.exports = {
  start: Start,
  index:index,
  radamnumber:radamnumber,
  postdata:postdata,
  end:end,
  say:say,
  input:input,
  arround:arround
};
