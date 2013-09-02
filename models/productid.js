'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var crypto = require('crypto');

var ProductidSchema = new Schema({
  isregist:    Boolean,  
  name:        String,
  address:     String,
  email:       String,
  updateTime:  {type: Date, default: Date.now},
  since:       {type: Date, default: Date.now},      
  uuid:        String,//兌換的商品
});


mongoose.model('Productid', ProductidSchema);
