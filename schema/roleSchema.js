var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

var RoleSchema = mongoose.Schema({
        name: String,
        access:Array,
    },
    {
        versionKey: false, // 不保存__v
        reateIndexes: true,
        autoIndex: true,
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    });

var RoleModel= mongoose.model('roles', RoleSchema);//表名

module.exports = RoleModel
