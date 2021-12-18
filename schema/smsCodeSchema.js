var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

var SmsCodeSchema = mongoose.Schema({
        phone: String,
        code: String,
        status: String
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

var SmsCodeModel= mongoose.model('smsCodes', SmsCodeSchema);//表名

module.exports = SmsCodeModel