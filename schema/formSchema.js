var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

var FormSchema = mongoose.Schema({
        name: String,
        type: String,
        month: String,
        time: String,
        firstLevel: String,
        secondLevel: String,
        thirdLevel:String,
        score:String,
        formId:String,
        dScore:String,
        total:String,
        role: String
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

var FormModel= mongoose.model('forms', FormSchema);//表名

module.exports = FormModel
