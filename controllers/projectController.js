const https = require('https');
var jwt = require('jsonwebtoken')
var projectModel = require('../schema/projectSchema')
var StandarsModel = require('../schema/standarSchema')
var ScoresModel = require('../schema/scoreSchema')
var FormModel = require('../schema/formSchema')
var FormLogModel = require('../schema/formLogSchema')
//测试接口
exports.test = (req, res) => {
    res.json({
        message: 'oop~'
    })
}

//新建
exports.projectAdd = async (req, res) => {
    if(!req.body.name) return res.status(500).send({
        message:'科室名称不能为空'
    })
    if(!req.body.type) return res.status(500).send({
        message:'科室类别不能为空'
    })
    if(req.body.id) {
        const item = await projectModel.findOne({_id: req.body.id});
        if(item)
        {
            const result = await item.updateOne({
                name: req.body.name,
                type:req.body.type
            })
            return res.status(200).send({
                message:'更新成功',
                data:result
            })
        }
    }

    //存进数据库
    const result = await projectModel.create({
        name: req.body.name,
        type:req.body.type
      
    })

    //返回token
    res.status(200).send({
        message:'创建成功',
        data:result
    })
}

exports.projectList = async (req, res)=>{
    const  type=new RegExp(req.body.type,'i')
    const  name=new RegExp(req.body.name,'i')
    if(!req.body.p) {
        const project = await projectModel.find({
            //模糊搜索的字段
            $and:[
                {$or: [{type: {$regex: type}}]}  ,
                {     $or: [{name: {$regex: name}}]}

            ]
        });
       return  res.status(200).send(
            {
                data:project
            }
        )
    }else {
        const page = parseInt(req.body.p || 0) * 10;
        const count = await projectModel.count();

        const project = await projectModel.find({
            //模糊搜索的字段
            $and:[
                {$or: [{type: {$regex: type}}]}  ,
                {     $or: [{name: {$regex: name}}]}

            ]
        }).limit(10).skip(page);
       return  res.status(200).send(
            {
                count:count,
                data:project
            }
        )
    }

}
/**
 * 删除项目
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
 exports.projectDelete = async (req, res) => {
    const id = req.body.id;
    const project = await projectModel.findById(id)
    if(!project)
    {
       return  res.status(202).send({
            message:'数据有误！'
        })
    }
    const result = await  project.deleteOne({_id:id})
    res.status(200).send({
        message:'删除成功'
    })
}

exports.getOption = async (req, res)=>{
    const project = await StandarsModel.find();
    res.status(200).send(
        {
            data:project
        }
    )
}
exports.scoreAdd = async (req, res) => {
    if(!req.body.firstLevel) return res.status(500).send({
        message:'一级指标不能为空'
    })
    if(!req.body.secondLevel) return res.status(500).send({
        message:'二级指标不能为空'
    })
    if(!req.body.thirdLevel) return res.status(500).send({
        message:'三级指标不能为空'
    })
    if(!req.body.score) return res.status(500).send({
        message:'单项分值不能为空'
    })

    const user = await ScoresModel.findOne({_id: req.body.id});
    if(user)
    {
        const result = await user.updateOne({
            firstLevel: req.body.firstLevel,
            secondLevel: req.body.secondLevel,
            thirdLevel:req.body.thirdLevel,
            score:req.body.score
        })
       return res.status(200).send({
        message:'更新成功',
        data:result
        })
    }
    //存进数据库
    const result = await ScoresModel.create({
        firstLevel: req.body.firstLevel,
        secondLevel: req.body.secondLevel,
        thirdLevel:req.body.thirdLevel,
        score:req.body.score
    })
    //返回token
    res.status(200).send({
        message:'创建成功',
        data:result
    })
}
exports.scoreList = async (req, res)=>{
    const page = parseInt(req.body.p || 0) * 10;
    const count = await ScoresModel.count();
    const result = await ScoresModel.find().sort({created_at: -1}).limit(10).skip(page);
    res.status(200).send(
        {
            count:count,
            data:result
        }
    )
}

/**
 * 删除项目
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
 exports.scoreDelete = async (req, res) => {
    const id = req.body.id;
    const project = await ScoresModel.findById(id)
    if(!project)
    {
       return  res.status(202).send({
            message:'数据有误！'
        })
    }
    const result = await  project.deleteOne({_id:id})
    res.status(200).send({
        message:'删除成功'
    })
}


/**
 * H5新建项目
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.formAdd = async (req, res) => {
    if(req.body.name === '') return res.status(500).send({
        message:'科室名称不能为空'
    })
    if(req.body.type === '') return res.status(500).send({
        message:'科室类别不能为空'
    })
    if(req.body.firstLevel ==='') return res.status(500).send({
        message:'一级指标不能为空'
    })
    if(req.body.secondLevel ==='') return res.status(500).send({
        message:'二级指标不能为空'
    })
    if(req.body.score ==='') {
        if(req.body.thirdLevel === '') {return res.status(500).send({
            message:'三级指标不能为空'
        })}
    }else {
        //新创建三级指标数据
        const score = await ScoresModel.create({
            firstLevel: req.body.firstLevel,
            secondLevel: req.body.secondLevel,
            thirdLevel:req.body.thirdLevel === ''  ? req.body.score :  req.body.thirdLevel
        })
        console.log(score)
    }

    if(req.body.time ==='') return res.status(500).send({
        message:'问题次数不能为空'
    })
    console.log(req.body.thirdLevel)
    //存进数据库
    const result = await FormModel.create({
        name: req.body.name,
        type:req.body.type,
        firstLevel: req.body.firstLevel,
        secondLevel: req.body.secondLevel,
        thirdLevel:req.body.thirdLevel,
        score:req.body.score,
        time:req.body.time
    })
    const result2 = await FormLogModel.create({
        name: req.body.name,
        role: req.body.role || '-',
        real_name: req.body.real_name || '-'
    })
    //返回token
    res.status(200).send({
        message:'创建成功',
        data:result
    })
}


/**
 * H5--List
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.formList = async (req, res)=>{
    const result = await FormModel.find().sort({created_at: -1});
    res.status(200).send(
        {
            data:result
        }
    )
}
/**
 * H5--LogList
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.formLogList = async (req, res)=>{
    const result = await FormLogModel.find();
    res.status(200).send(
        {
            data:result
        }
    )
}
/**
 * admin--LogList
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.adminFormLogList = async (req, res)=>{
    const page = parseInt(req.body.p || 0) * 10;
    const count = await FormLogModel.count();
    const  role= new RegExp(req.body.role,'i')
    const  name= new RegExp(req.body.name,'i')
    const project = await FormLogModel.find({
        //模糊搜索的字段
        $and:[
            {$or: [{role: {$regex: role}}]},
            {$or: [{name: {$regex: name}}]}

        ]


    }).sort({created_at: -1}).limit(10).skip(page);
    res.status(200).send(
        {
            count:count,
            data:project
        }
    )
}
/**
 * H5删除项目
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.formDelete = async (req, res) => {
    const id = req.body.id;
    const project = await FormModel.findById(id)
    if(!project)
    {
        return  res.status(202).send({
            message:'数据有误！'
        })
    }
    const result = await  project.deleteOne({_id:id})
    res.status(200).send({
        message:'删除成功'
    })
}