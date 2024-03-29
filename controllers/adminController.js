var AdminModel = require('../schema/adminSchema')
var RoleModel = require('../schema/roleSchema')
var SmsCodeModel = require('../schema/smsCodeSchema')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
let qiniu = require('qiniu');
const tencentcloud = require("tencentcloud-sdk-nodejs");
const SmsClient = tencentcloud.sms.v20210111.Client;
let config = {
    "AK": "OdQtCSapzhBdei-847uTeO_2iA70TBXg469YmeRp",
    "SK": "F1hX7oY0nczxejf37DxLKVVLXmjO4AvktaTiDRys",
    "Bucket": "taipingeasy"
}
/**
 * 注册
 * @param req
 * @param res
 */
exports.register = async (req, res) => {
    // 根据用户名找用户
    const user = await AdminModel.findOne({mobile: req.body.mobile});
    if(user)
    {
        const result = await user.updateOne({
        name: req.body.name,
        password:req.body.password,
        real_name:req.body.real_name,
        mobile:req.body.mobile,
            role:req.body.role,
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
        role:req.body.role,
        access:req.body.access
    })

    //返回token
    res.status(200).send({
        message:'创建成功',
        data:result
    })
}
/**
 * 获取验证码
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getSms = async (req,res)=>{
// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
    const phone = req.body.phone;
    //校验手机号
    if(!(/^1[3456789]\d{9}$/.test(phone))){
        return res.status(500).send({
            message:'手机号码错误'
        })
    }
    const clientConfig = {
        credential: {
            secretId: "AKID20i9IBoAE3cuvgAMHvIOEm33lCOJxKQF",
            secretKey: "ZstfANJyMUMwGI3XkgLiqgFXYIlxrVtz",
        },
        region: "ap-guangzhou",
        profile: {
            httpProfile: {
                endpoint: "sms.tencentcloudapi.com",
            },
        },
    };

    const client = new SmsClient(clientConfig);
    //生成6位的验证码
    let code = ('000000' + Math.floor(Math.random() * 999999)).slice(-6)

    const params = {
        //手机号码
        "PhoneNumberSet": [
            `+86${phone}`
        ],
        "SmsSdkAppId": "1400612561",
        "SignName": "嗨酷数字科技",
        "TemplateId": "1245395",
        "TemplateParamSet": [
            code,'3'
        ]
    };
    client.SendSms(params).then(
        async (data) => {
            //发送成功操作逻辑
            console.log(data);
            if(data.SendStatusSet[0].Code === 'Ok') {
                //存表
                await SmsCodeModel.create({phone: phone,code:code,status:'00'});
               return res.status(200).send({
                    message:'验证码发送成功'
                })
            }else {
               return res.status(500).send({
                    message:'验证码发送失败'
                })
            }

        },
        (err) => {
            console.error("error", err);
            return res.status(500).send({
                message:'验证码发送失败'
            })

        }
    );

}
/**
 * 修改密码
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.changePassword = async (req,res)=>{
    const token = String(req.headers.authorization || '').split(' ').pop();
    if (!token) //校验token
    {
        res.status(401).send({
            message:'请先登录'
        })
    }

    const {id} = jwt.verify(token, process.env.JWT_SCRECT)

    if (!id)//校验解密信息
    {
        res.status(401).send({
            message:'请先登录'
        })
    }
    const user =await AdminModel.findById(id)

    if (!user)//校验用户是否存在
    {
        res.status(401).send({
            message:'请先登录'
        })
    }
    // 校验原密码
    const password = bcrypt.compareSync(req.body.oldpassword, user.password)
    if(!password)
    {
        return res.status(200).send({
            code:'0001',
            message:'原密码密码错误'
        })
    }
    await user.updateOne({
        password:req.body.password
    })
    return res.status(200).send({
        code:'0000',
        message:'修改成功'
    })
}
/**
 * H5 - 登录
 * @param req
 * @param res
 */
exports.h5login = async (req, res) => {
    // 先查找验证码
    const result = await SmsCodeModel.find({phone:req.body.name,status:'00'}).sort({created_at: -1});
    //查询最新一条
    const codeResult = result[0]

    if(!codeResult) {
        return res.status(501).send({
            message:'该手机信息有误'
        })
    }
    console.log('codeResult',codeResult,req.body.code)
    if(codeResult.code !== req.body.code) {
        return res.status(501).send({
            message:'验证码错误'
        })
    }
    // 根据用户名找用户
    const user = await AdminModel.findOne({mobile: req.body.name});
    if( !user )
    {
        return res.status(401).send({
            message:'用户不存在'
        })
    }
    //校验密码
    // const password = bcrypt.compareSync(req.body.password, user.password)
    // if(!password)
    // {
    //     return res.status(401).send({
    //         message:'密码错误'
    //     })
    // }
    //返回token
    const token = jwt.sign({
        id:user._id,
        name:user.real_name
    },process.env.JWT_SCRECT,{ expiresIn: '1d' })
    await codeResult.updateOne({status:'01'})
    res.status(200).send({
        token:token,
        data:{
            role:user.role,
            name:user.real_name,
            _id:user._id,
            mobile:user.mobile
        }
    })
}
/**
 * 登录
 * @param req
 * @param res
 */
exports.login = async (req, res) => {
    // 根据用户名找用户
    const user = await AdminModel.findOne({mobile: req.body.name});

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
        name:user.real_name
    },process.env.JWT_SCRECT,{ expiresIn: '1d' })
    res.status(200).send({
        token:token,
        data:{
            role:user.role,
            name:user.real_name,
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
    const  role=new RegExp(req.body.role,'i')
    const  mobile=new RegExp(req.body.mobile,'i')
    const  real_name=new RegExp(req.body.real_name,'i')
    const user = await AdminModel.find(
        {
            //模糊搜索的字段
            $and:[
                {$or: [{role: {$regex: role}}]},
                {$or: [{mobile: {$regex: mobile}}]},
                {$or: [{real_name: {$regex: real_name}}]}
            ]
        }
    ).select(['name','mobile','real_name','access','role','created_at']).limit(10).skip(page);
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
                role:v.role,
                created_at:v.created_at,
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
/**
 * 获取七牛云token
 */
exports.getToken = (req, res) => {
    let mac = new qiniu.auth.digest.Mac(config.AK, config.SK);
    let options = {
        scope: config.Bucket,
        expires: 3600 * 24
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    if (!uploadToken) {
        return res.status(500).send({
            message:'请求超时'
        })

    }
    res.status(200).send({
        token:uploadToken
    })
}

/**
 * 新增角色
 * @param req
 * @param res
 */
exports.addRole = async (req, res) => {
    console.log(req.body.id)
    // 根据用户名找用户
    if(req.body.id) {
        const user = await RoleModel.findOne({_id: req.body.id});
        if(user)
        {
            const result = await user.updateOne({
                name: req.body.name,
                access:req.body.access
            })
            return res.status(200).send({
                message:'更新成功',
                data:result
            })
        }
    }

    //存进数据库
    const result = await RoleModel.create({
        name: req.body.name,
        access:req.body.access
    })

    //返回token
    res.status(200).send({
        message:'创建成功',
        data:result
    })
}
/**
 * 删除角色
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.delRole = async (req, res) => {
    const id = req.body.id;

    const user = await RoleModel.findById(id)
    if(!user)
    {
        return  res.status(202).send({
            message:'数据有误！'
        })
    }
    const result = await user.deleteOne({_id:id})
    res.status(200).send({
        message:'删除成功'
    })
}
/**
 * 角色列表
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.roleList = async (req, res) => {
    const page = parseInt(req.body.p || 0) * 10;
    const count = await RoleModel.count();
    const  name=new RegExp(req.body.name,'i')
    const user = await RoleModel.find(
        {
            //模糊搜索的字段
            $and:[
                {$or: [{name: {$regex: name}}]}
            ]
        }
    ).limit(10).skip(page);
    res.status(200).send(
        {
            count:count,
            data:user
        }
    )
}
