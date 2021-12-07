var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

var Standarchema = mongoose.Schema({
  name: String,
  type: String,
  value:String
});

var StandarsModel= mongoose.model('standars', Standarchema);//表名

module.exports = StandarsModel