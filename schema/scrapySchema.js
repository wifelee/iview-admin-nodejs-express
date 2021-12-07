var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

var ScrapySchema = mongoose.Schema({
  title: String,
  url: String,
  date:String,
  content:String,
});

var ScrapyModel= mongoose.model('scrapys', ScrapySchema);//表名

module.exports = ScrapyModel