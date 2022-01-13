var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

var TypeSchema = mongoose.Schema({
        name: String,
        code: String,
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

var TypeModel= mongoose.model('types', TypeSchema);//表名

module.exports = TypeModel
