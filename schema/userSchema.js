var mongoose = require('mongoose');


var UserSchema = mongoose.Schema({
  name: String,
  age:String,
  mobile:String
});

var UserModel= mongoose.model('users', UserSchema);//表名

module.exports = UserModel
