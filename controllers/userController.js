var UserModel = require('../schema/userSchema')

exports.add = async (req, res)=>{
    // UserModel.find({}, (err, user)=>{
    //     if(err) return handleError(err);
    //     else res.json({
    //         code:200,
    //         data:user
    //     })
    // })
   const user = await UserModel.create({
        name:'wifelee',
        age:'12',
        mobile:'12313'
    })
     res.json({
            code:200,
            data:user
        })
}
