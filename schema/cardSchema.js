var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

var CardSchema = mongoose.Schema({
        month: String,
        cardName: String,
        type:String,
        name:String,
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

var CardModel= mongoose.model('cards', CardSchema);//表名

module.exports = CardModel