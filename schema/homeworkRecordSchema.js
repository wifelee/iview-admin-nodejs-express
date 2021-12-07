var mongoose = require('mongoose');

var HomeworkRecordSchema = mongoose.Schema({
  title: String,
  teacherId:String,
  content:String,
  score:String,
  comment:'String',
  answer:'Array',
  studentID:'String',
  status:{
    type:'Number',
    default:0//0是 未完成 1是 完成
  },
  type:String,//1语音2文字
});

var homeworkRecordModel= mongoose.model('homeworkRecordModel', HomeworkRecordSchema);//表名

module.exports = homeworkRecordModel
