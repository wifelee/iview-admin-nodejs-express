var AdminModel = require('../schema/adminSchema')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
/**
 * 注册
 * @param req
 * @param res
 */
exports.register = async (req, res) => {
    // 根据用户名找用户
    const user = await AdminModel.findOne({name: req.body.name});
    if(user)
    {
        const result = await user.updateOne({
        name: req.body.name,
        password:req.body.password,
        real_name:req.body.real_name,
        mobile:req.body.mobile,
        access:req.body.access
        })
       return res.status(200).send({
        message:'更新成功',
        data:result
        })
    }
    //存进数据库
    const result = await AdminModel.create({
        name: req.body.name,
        password:req.body.password,
        real_name:req.body.real_name,
        mobile:req.body.mobile,
        access:req.body.access
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
/**
 * 管理员列表
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.adminList = async (req, res) => {
    const page = parseInt(req.body.p || 0) * 10;
    const count = await AdminModel.count();
    const user = await AdminModel.find().select(['name','mobile','real_name','access']).limit(10).skip(page);
    res.status(200).send(
        {
            count:count,
            data:user.map(v =>
        {
            return{
                username:v.name,
                mobile:v.mobile,
                realName:v.real_name,
                access:v.access,
                id:v._id
            }
        })
        }
    )
}
/**
 * 删除管理员
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.deleteAdmin = async (req, res) => {
    //先判断是否现在登录的管理员
    const token = String(req.headers.authorization || '').split(' ').pop();
    const id = req.body.id;
    if(jwt.verify(token, process.env.JWT_SCRECT).id === id)
    {
        return  res.status(202).send({
            message:'当前管理员正在登录'
        })
    }

    const user = await AdminModel.findById(id)
    if(!user)
    {
       return  res.status(202).send({
            message:'数据有误！'
        })
    }
    const result = await  user.deleteOne({_id:id})
    res.status(200).send({
        message:'删除成功'
    })
}
