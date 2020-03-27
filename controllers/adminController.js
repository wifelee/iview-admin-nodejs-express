var AdminModel = require('../schema/adminSchema')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
/**
 * 注册
 * @param req
 * @param res
 */
exports.register = async (req, res) => {
    // 根据用户名找用户
    const name = await AdminModel.findOne({name: req.body.name});
    if(name)
    {
       return  res.status(501).send({
            message:'管理员已存在，请直接登录'
        })
    }
    //存进数据库
    const result = await AdminModel.create({
        name: req.body.name,
        password:req.body.password,
        real_name:req.body.real_name,
        mobile:req.body.mobile
    })

    //返回token
    res.status(200).send({
        message:'创建成功',
        data:result
    })
}

/**
 * 登录
 * @param req
 * @param res
 */
exports.login = async (req, res) => {
    // 根据用户名找用户
    const user = await AdminModel.findOne({name: req.body.name});
    if( !user )
    {
        return res.status(401).send({
            message:'用户不存在'
        })
    }
    //校验密码
    const password = bcrypt.compareSync(req.body.password, user.password)
    if(!password)
    {
        return res.status(401).send({
            message:'密码错误'
        })
    }
    //返回token
    const token = jwt.sign({
        id:user._id,
        name:user.name
    },process.env.JWT_SCRECT,{ expiresIn: '1d' })
    res.status(200).send({
        token:token,
        data:{
            name:user.name,
            _id:user._id,
            mobile:user.mobile
        }
    })
}

exports.test = (req, res) => {
    res.json({
        message: 'oop~'
    })
}
