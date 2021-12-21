var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

var ScoreSchema = mongoose.Schema({
  firstLevel: String,
  secondLevel: String,
  thirdLevel:String,
    total:String,
  score:String,
    code:String

},
{
    versionKey: false, // 不保存__v
    reateIndexes: true,
    autoIndex: true,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
}
);

var ScoreModel= mongoose.model('scores', ScoreSchema);//表名

module.exports = ScoreModel