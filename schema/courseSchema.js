var mongoose = require('mongoose');

var CourseSchema = mongoose.Schema({
  title: String,
  teacherId:String
});

var courseModel= mongoose.model('courseModel', CourseSchema);//表名

module.exports = courseModel
