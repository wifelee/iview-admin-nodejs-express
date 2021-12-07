const https = require('https');
var jwt = require('jsonwebtoken')
var miniUserModel = require('../schema/MiniprogramSchema')
var homework = require('../schema/homeworkRecordSchema')

//测试接口
exports.test = (req, res) => {
    res.json({
        message: 'oop~'
    })
}

//获取openid
exports.getCode = (req, res) => {
    let code = req.body['code'];
    const loginUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.APPID}&secret=${process.env.SECRET}&js_code=${code}&grant_type=authorization_code`
    https.get(loginUrl, (resp) => {
        let data;
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data = chunk.toString('utf8');
        });
        //返回token
        const token = jwt.sign({
            code: code
        },process.env.JWT_SCRECT,{ expiresIn: '1d' })

        resp.on('end', () => {
            res.status(200).send({
                token:token,
                data:JSON.parse(data)
            })
        });
    }).on("error", (err) => {
        res.json({
            code: 500,
            status: "fail",
            msg: err.message
        });
    });
}
//存用户信息
exports.saveUserInfo = async (req, res) => {
    // 根据openid找用户
    const user = await miniUserModel.findOne({openid: req.body.openid});
    if(user)
    {
        const result = await user.updateOne({
        nickname: req.body.nickname,
        avartar:req.body.avartar
        })
       return res.status(200).send({
        message:'更新成功',
        data:result
        })
    }
    //存进数据库
    const result = await miniUserModel.create({
        nickname: req.body.nickname,
        avartar:req.body.avartar,
        openid:req.body.openid
    })

    //返回token
    res.status(200).send({
        message:'创建成功',
        data:result
    })
}

//获取用户信息
exports.getUserInfo = async (req, res)=>{
    const user = await miniUserModel.findOne({openid: req.body.openid});
    if(!user){
        return res.status(401).send({
            message:'用户不存在'
        })
    }
    res.status(200).send({
        message:'成功',
        data:{
            nickName:user.nickname,
            avatarUrl:user.avartar,
            status:user.status
        }
    })
}

    exports.addHomework = async  (req, res) => {
        const homeworkID = await homework.findOne({_id:req.body.id})
        if(homeworkID)
        {//如果存在则是更新
            const result = await homework.updateOne({
            title: req.body.title,
            content:req.body.content,
            type:req.body.type
            })
           return res.status(200).send({
            message:'更新成功',
            data:result
            })
        }
        //存进数据库
        const result = await homework.create({
            title: req.body.title,
            content:req.body.content,
            teacherId:req.body.teacherId,
            type:req.body.type
        })

        //返回token
        res.status(200).send({
            message:'创建成功',
            data:result
        })
    }
exports.getHomework = async (req, res)=>{
    const result = await homework.find({status:req.body.status});
    res.status(200).send({
        message:'成功',
        data:result
    })
}
exports.submitHomework = async (req, res)=> {
    const homeworkData = await homework.findOne({_id:req.body._id})
    if(!homeworkData){
        return res.status(500).send('找不到对应数据')
    }
    const result = await homework.update({
        studentID: req.body.openid,
        answer: req.body.answer,
        status:1
    })
    res.status(200).send({
        message:'提交成功',
        data:result
    })
}
