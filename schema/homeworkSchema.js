var mongoose = require('mongoose');

var HomeworkSchema = mongoose.Schema({
  title: String,
  courseId:String,
  teacherId:String,
  content:String,
  type:String,//1语音2文字
});

var homeworkModel= mongoose.model('homeworkModel', HomeworkSchema);//表名

module.exports = homeworkModel
