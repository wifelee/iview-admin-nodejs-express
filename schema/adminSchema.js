var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

var AdminSchema = mongoose.Schema({
  name: String,
  password:{
      type: String, set(val) {
         return bcrypt.hashSync(val,10)
      }},
  mobile:String,
  real_name:String,
    role:String,
  access:Array,
});

var AdminModel= mongoose.model('admins', AdminSchema);//表名

module.exports = AdminModel
