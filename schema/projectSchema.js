var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

var ProjectSchema = mongoose.Schema({
  name: String,
  type: String,
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

var ProjectModel= mongoose.model('project', ProjectSchema);//表名

module.exports = ProjectModel