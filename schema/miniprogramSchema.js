var mongoose = require('mongoose');


var MiniprogramSchema = mongoose.Schema({
  nickname: String,
  real_name:String,
  openid:String,
  avartar:String,
  remark:String,
  course:Array,//课程
  status:{
      type:String,
      defaule:0
  }//身份1老师0学生
}, {
  //设置时间戳
  timestamps: true
});

var miniUserModel= mongoose.model('miniUserModel', MiniprogramSchema);//表名

module.exports = miniUserModel
