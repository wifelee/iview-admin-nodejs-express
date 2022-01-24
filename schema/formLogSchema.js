var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

var FormLogSchema = mongoose.Schema({
        name: String,
        role: String,
        real_name: String,
        totalScore: String,
        month:String,
        userId:String,
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

var FormLogModel= mongoose.model('formLogs', FormLogSchema);//表名

module.exports = FormLogModel
