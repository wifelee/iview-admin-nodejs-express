const https = require('https');
var fs = require('fs');
var projectModel = require('../schema/projectSchema')
var typeModel = require('../schema/typeSchema')
var StandarsModel = require('../schema/standarSchema')
var ScoresModel = require('../schema/scoreSchema')
var FormModel = require('../schema/formSchema')
var FormLogModel = require('../schema/formLogSchema')
var CardModel = require('../schema/cardSchema')
var tools = require('../public/javascripts/tools')
const {isEmpty,formatDate} = require("../public/javascripts/tools");
const ExcelJS = require('exceljs');


/**
 *导出excel - 全部的form
 * @param req
 * @param res
 */
exports.onExportExcel = async (req, res)=>{
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Me';
    workbook.lastModifiedBy = 'Her';
    workbook.created = new Date(1985, 8, 30);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2016, 9, 27);
    const sheet = workbook.addWorksheet('My Sheet');
    let worksheet = workbook.getWorksheet('My Sheet')
    worksheet.columns = [
        { header: '序号', key: 'index'},
        { header: '科室', key: 'name' ,width:30},
        { header: '检查时间', key: 'date' ,width:30},
        // { header: '项目代码', key: 'code'},
        { header: '存在问题', key: 'thirdLevel' ,width:40},
        { header: '发生频次', key: 'time' ,width:10},
        { header: '分值', key: 'score' ,width:10},
        { header: '实际扣分', key: 'dScore' ,width:10},
        { header: '得分', key: 'totalScore' ,width:10},
    ];
    //先查出所有科室的数据
    let depart = await projectModel.find();

    // 再查所有form 当前logId的
    const form = await FormModel.find({formId:req.body.id});
    let obj = {}
    if(depart.length > 0) {
        depart = depart.map(a=>a.name);
        for(let i of depart) {
            const arr = form.filter(a=>a.name === i)
            if(arr.length > 0 ){
                obj[i] = [...arr]
            }
        }
    }else {
        return res.status(500).send({
            message: '无数据',
            data: null
        })
    }

    //处理数据
    let arr = []
    for(let i in obj) {

        let score = 0
        for(let j of obj[i]) {
            score = parseFloat(score + parseFloat(j['dScore']))
        }
        obj[i+'_total'] = parseFloat(100 - score)
        arr = [...arr,...obj[i]]
    }
    let temp = ''
    let tempArr = []
   arr.forEach((a,i)=>{
       if(i === 0) {
           temp = a.name
           tempArr.push(i)
       }
       if(a.name !== temp) {
           tempArr.push(i-1)
           temp = a.name
       }
       //插入数据
       worksheet.getRow(i + 2).values = [
           i + 1,
           a['name'],
           formatDate(a['created_at'],'year'),
           // a['code'],
           a['thirdLevel'],
           a['time'],
           a['score'],
           a['dScore'],
           obj[a.name + '_total']
       ]

   })
    tempArr.push(arr.length-1)
    let fianlTemp = []
    for(let i = 0;i < tempArr.length - 1; i++ ) {
        if(i === 0) {
            fianlTemp.push([tempArr[i],tempArr[i+1]])
        }else {
            fianlTemp.push([tempArr[i]+1,tempArr[i+1]])
        }

    }
    for(let i of fianlTemp) {
        worksheet.mergeCells(`B${i[0]+2}:B${i[1]+2}`);
        worksheet.mergeCells(`H${i[0]+2}:H${i[1]+2}`);
        worksheet.getCell(`B${i[0]+2}`).alignment = { vertical: 'middle', horizontal: 'center' };
    }

//Writing XLSX
    const fileName = '全院6S质量检查现场反馈表.xlsx'
    workbook.xlsx.writeFile(`files/${fileName}`)
        .then(function(result) {
            return res.status(200).send({
                message: '导出成功',
                url:`static/${fileName}`,
                arr:arr,
                data: obj,
                tempArr:tempArr,
                temp:temp,
                fianlTemp:fianlTemp
            })

        });

}
//测试接口
exports.test = (req, res) => {
    res.json({
        message: 'oop~'
    })
}
/**
 * 科室类别添加
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.typeAdd = async (req, res) => {
    if (!req.body.name) return res.status(500).send({
        message: '类别名称不能为空'
    })
    if (!req.body.code) return res.status(500).send({
        message: '科室类别代码不能为空'
    })
    if (req.body.id) {
        const item = await typeModel.findOne({_id: req.body.id});
        if (item) {
            const result = await item.updateOne({
                name: req.body.name,
                code: req.body.code
            })
            return res.status(200).send({
                message: '更新成功',
                data: result
            })
        }
    }

    //存进数据库
    const result = await typeModel.create({
        name: req.body.name,
        code: req.body.code
    })

    //返回token
    res.status(200).send({
        message: '创建成功',
        data: result
    })
}
/**
 * 科室类别列表
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.typeList = async (req, res) => {
    const code = new RegExp(req.body.code, 'i')
    const name = new RegExp(req.body.name, 'i')
    if (req.body.p === null || req.body.p === 'undefined' || req.body.p === '') {
        const project = await typeModel.find({
            //模糊搜索的字段
            $and: [
                {$or: [{code: {$regex: code}}]},
                {$or: [{name: {$regex: name}}]}

            ]
        });
        return res.status(200).send(
            {
                data: project
            }
        )
    } else {
        const page = parseInt(req.body.p || 0) * 10;
        const project = await typeModel.find({
            //模糊搜索的字段
            $and: [
                {$or: [{code: {$regex: code}}]},
                {$or: [{name: {$regex: name}}]}
            ]
        }).sort({created_at: -1}).limit(10).skip(page);
        return res.status(200).send(
            {
                count: project.length,
                data: project
            }
        )
    }

}
exports.typeListAll = async (req, res) => {
    const project = await typeModel.find();
    return res.status(200).send(
        {
            data: project
        }
    )
}
/**
 * 科室类别删除
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.typeDelete = async (req, res) => {
    const id = req.body.id;
    const project = await typeModel.findById(id)
    if (!project) {
        return res.status(202).send({
            message: '数据有误！'
        })
    }
    const result = await project.deleteOne({_id: id})
    res.status(200).send({
        message: '删除成功'
    })
}
/**
 * 新建科室信息
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
//新建
exports.projectAdd = async (req, res) => {
    if (!req.body.name) return res.status(500).send({
        message: '科室名称不能为空'
    })
    if (!req.body.type) return res.status(500).send({
        message: '科室类别不能为空'
    })
    if (!req.body.code) return res.status(500).send({
        message: '科室类别代码不能为空'
    })
    if (req.body.id) {
        const item = await projectModel.findOne({_id: req.body.id});
        if (item) {
            const result = await item.updateOne({
                name: req.body.name,
                type: req.body.type,
                code: req.body.code
            })
            return res.status(200).send({
                message: '更新成功',
                data: result
            })
        }
    }

    //存进数据库
    const result = await projectModel.create({
        name: req.body.name,
        type: req.body.type,
        code: req.body.code
    })

    //返回token
    res.status(200).send({
        message: '创建成功',
        data: result
    })
}
/**
 * 科室信息列表
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.projectList = async (req, res) => {
        const page = parseInt(req.body.p || 0) * 10;
        const count = await projectModel.count();
        const type = new RegExp(req.body.code, 'i')
        const name = new RegExp(req.body.name, 'i')
        const project = await projectModel.find({
            //模糊搜索的字段
            $and: [
                {$or: [{type: {$regex: type}}]},
                {$or: [{name: {$regex: name}}]}
            ]
        }).sort({created_at: -1}).limit(10).skip(page);
        return res.status(200).send(
            {
                count: count,
                data: project
            }
        )
}
/**
 * H5科室信息列表
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.departH5List = async (req, res) => {
    const code = req.body.code || ''
    const project = await projectModel.find({
        code:code
    });
    return res.status(200).send(
        {
            data: project
        }
    )
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
    if (!project) {
        return res.status(202).send({
            message: '数据有误！'
        })
    }
    const result = await project.deleteOne({_id: id})
    res.status(200).send({
        message: '删除成功'
    })
}
/**
 * 作废（获取下拉类目
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.projectAllList = async (req, res) => {
    const project = await projectModel.find();
    res.status(200).send(
        {
            data: project
        }
    )
}
exports.getOption = async (req, res) => {
    const project = await StandarsModel.find();
    res.status(200).send(
        {
            data: project
        }
    )
}
/**
 * 新增项目
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.scoreAdd = async (req, res) => {
    if (!req.body.firstLevel) return res.status(500).send({
        message: '一级指标不能为空'
    })
    if (!req.body.code) return res.status(500).send({
        message: '一级指标项目代码不能为空'
    })
    if (!req.body.secondLevel) return res.status(500).send({
        message: '二级指标不能为空'
    })
    // if (!req.body.thirdLevel) return res.status(500).send({
    //     message: '三级指标不能为空'
    // })
    if (!req.body.score) return res.status(500).send({
        message: '单项分值不能为空'
    })

    const user = await ScoresModel.findOne({_id: req.body.id});
    if (user) {
        const result = await user.updateOne({
            firstLevel: req.body.firstLevel,
            secondLevel: req.body.secondLevel,
            thirdLevel: req.body.thirdLevel,
            score: req.body.score,
            total: req.body.total,
            code: req.body.code
        })
        return res.status(200).send({
            message: '更新成功',
            data: result
        })
    }
    //存进数据库
    const result = await ScoresModel.create({
        firstLevel: req.body.firstLevel,
        secondLevel: req.body.secondLevel,
        thirdLevel: req.body.thirdLevel,
        total: req.body.total,
        score: req.body.score || '0.5',
        code: req.body.code
    })
    //返回token
    res.status(200).send({
        message: '创建成功',
        data: result
    })
}
exports.scoreList = async (req, res) => {
    const page = parseInt(req.body.p || 0) * 10;
    const count = await ScoresModel.count();
    const result = await ScoresModel.find().sort({created_at: -1}).limit(10).skip(page);
    res.status(200).send(
        {
            count: count,
            data: result
        }
    )
}


/**
 * 红黄牌登记
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.cardAdd = async (req, res) => {
    if (tools.isEmpty(req.body.month)) return res.status(500).send({
        message: '月份不能为空'
    })
    if (tools.isEmpty(req.body.cardName)) return res.status(500).send({
        message: '红黄牌名称不能为空'
    })
    if (tools.isEmpty(req.body.type)) return res.status(500).send({
        message: '科室类别不能为空'
    })
    if (tools.isEmpty(req.body.name)) return res.status(500).send({
        message: '科室名称不能为空'
    })

    const card = await CardModel.findOne({_id: req.body.id});
    if (card) {
        const result = await card.updateOne({
            month: req.body.month,
            cardName: req.body.cardName,
            type: req.body.type,
            count: req.body.count,
            name: req.body.name
        })
        return res.status(200).send({
            message: '更新成功',
            data: result
        })
    }
    //存进数据库
    const result = await CardModel.create({
        month: req.body.month,
        cardName: req.body.cardName,
        count: req.body.count,
        type: req.body.type,
        name: req.body.name
    })
    //返回token
    res.status(200).send({
        message: '创建成功',
        data: result
    })
}
/**
 * 红黄牌列表
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.cardList = async (req, res) => {
    const type = new RegExp(req.body.type, 'i')
    const name = new RegExp(req.body.name, 'i')
    if (req.body.p === null || req.body.p === 'undefined' || req.body.p === '') {
        const project = await CardModel.find({
            //模糊搜索的字段
            $and: [
                {$or: [{type: {$regex: type}}]},
                {$or: [{name: {$regex: name}}]}

            ]
        });
        return res.status(200).send(
            {
                data: project
            }
        )
    } else {
        const page = parseInt(req.body.p || 0) * 10;

        const count = await CardModel.count();
        const project = await CardModel.find({
            //模糊搜索的字段
            $and: [
                {$or: [{type: {$regex: type}}]},
                {$or: [{name: {$regex: name}}]}
            ]
        }).sort({created_at: -1}).limit(10).skip(page);
        return res.status(200).send(
            {
                count: count,
                data: project
            }
        )
    }

}
/**
 * H5-scorelist
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.h5scoreList = async (req, res) => {
    const result = await ScoresModel.find().sort({created_at: -1});
    res.status(200).send(
        {
            data: result
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
    if (!project) {
        return res.status(202).send({
            message: '数据有误！'
        })
    }
    const result = await project.deleteOne({_id: id})
    res.status(200).send({
        message: '删除成功'
    })
}

const getDate = (timeStamp='',type)=>{
    let d;
    if(timeStamp) {
         d = new Date(timeStamp)
    }else {
         d = new Date()
    }
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const date = d.getDate()

    const monthResult = year + '-' + (month < 10 ? `0${month}` : month)
    const dateResult = year + '-' + (month < 10 ? `0${month}` : month)  + '-' + (date < 10 ? `0${date}` : date)
    console.log("mmmm",type === 'month' ? monthResult : dateResult)
    return type === 'month' ? monthResult : dateResult
}
/**
 * H5新建项目
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.formAdd = async (req, res) => {
    if (req.body.name === '') return res.status(500).send({
        message: '科室名称不能为空'
    })
    if (req.body.type === '') return res.status(500).send({
        message: '科室类别不能为空'
    })
    if (req.body.firstLevel === '') return res.status(500).send({
        message: '一级指标不能为空'
    })
    if (req.body.secondLevel === '') return res.status(500).send({
        message: '二级指标不能为空'
    })
    const monthResult = getDate('','month')
    let score = 0.5
    if(req.body.firstLevel === '公共设施' && req.body.secondLevel === '灭火器放置标准' ) score = 1
    if(req.body.firstLevel === '长效机制' && req.body.secondLevel === '管理标准') score = 3
    const Scores = await ScoresModel.findOne({firstLevel:req.body.firstLevel})
    const codeTotal = Scores.total
    const codeValue = Scores.code
    if (req.body.score === '') {
        if (req.body.thirdLevel === '') {
            return res.status(500).send({
                message: '三级指标不能为空'
            })
        }
    } else {

        //新创建三级指标数据
        //第九或者第十个是1分 其他都是0.5
        await ScoresModel.create({
            firstLevel: req.body.firstLevel,
            secondLevel: req.body.secondLevel,
            score:score,
            code:codeValue,
            total:codeTotal,
            thirdLevel: req.body.thirdLevel
        })
    }

    if (req.body.time === '') return res.status(500).send({
        message: '问题次数不能为空'
    })
    let formId =''
    //先判断是否当日已有数据输入
    const stamp1 = new Date(new Date().setHours(0, 0, 0, 0)); //获取当天零点的时间
    const stamp2 = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1); //获取当天23:59:59的时间
    const logResult = await FormLogModel.find({
            month:monthResult,
            role:req.body.role
        }
    )
    //有则关联到当日的_id
    if(logResult.length === 0) {
        const result2 = await FormLogModel.create({
            userId:req.body.userId,
            name: req.body.name,
            month:monthResult,
            role: req.body.role || '-',
            real_name: req.body.real_name || '-'
        })
        formId = result2._id
    }else {
        console.log("getDate",getDate('','date'),getDate(logResult[0].created_at,'date'))
        if(logResult.length === 1) {
            if(req.body.role !== '护士长') {
                if( getDate('','date') !== getDate(logResult[0].created_at,'date')){
                    return res.status(500).send({
                        message: '您本月已提交过该科室的评分表了'
                    })
                }
            }else {
                if( getDate('','date') !== getDate(logResult[0].created_at,'date')){
                    const result2 = await FormLogModel.create({
                        userId:req.body.userId,
                        name: req.body.name,
                        month:monthResult,
                        role: req.body.role || '-',
                        real_name: req.body.real_name || '-'
                    })
                    formId = result2._id
                }
            }
        }else {
            return res.status(500).send({
                message: '您本月已提交过该科室的评分表了'
            })
        }
        //有记录后就ID就是这条记录的_id
        formId = logResult[0]._id
    }
    // 计算得分
    const time = parseInt(req.body.time)
    let dScore = parseFloat(time * score)

    let total = 100

    if(dScore  > codeTotal ) {
        dScore = codeTotal
    }
    total = parseFloat(total - dScore)

    //存进数据库
    const result = await FormModel.create({
        name: req.body.name,
        type: req.body.type,
        firstLevel: req.body.firstLevel,
        secondLevel: req.body.secondLevel,
        thirdLevel: req.body.thirdLevel,
        score: score,
        month:monthResult,
        total:total,
        dScore:dScore,
        role: req.body.role || '-',
        time: req.body.time,
        formId:formId
    })
    // 检查是否有红黄牌记录
    if(req.body.role !== '护士长') {
        if(req.body.cardName!=='' && req.body.count !== '') {
            const cardResult = await CardModel.create({
                month: monthResult,
                cardName: req.body.cardName,
                count: req.body.count,
                type: req.body.type,
                name: req.body.name
            })
        }
    }
    res.status(200).send({
        message: '创建成功',
        data: result
    })
}


/**
 * H5--List
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.formList = async (req, res) => {
    const result = await FormModel.find().sort({created_at: -1});
    res.status(200).send(
        {
            data: result
        }
    )
}
/**
 * H5--LogList
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.formLogList = async (req, res) => {
    const result = await FormLogModel.find({userId:req.body.userId});
    res.status(200).send(
        {
            data: result
        }
    )
}
/**
 * admin--LogList
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.adminFormLogList = async (req, res) => {
    const page = parseInt(req.body.p || 0) * 10;
    const count = await FormLogModel.count();
    const role = req.body.role
    const real_name = req.body.real_name
    const month = req.body.month
    const param = {}
    if(role) param.role = role
    if(real_name) param.real_name = real_name
    if(month) param.month = month
    if(JSON.stringify(param) == "{}") {
        project = await FormLogModel.find({}).sort({created_at: -1}).limit(10).skip(page)
        return     res.status(200).send(
            {
                count: JSON.stringify(param) == "{}" ? count :  project.length,
                data: project
            }
        )
    }
    param.role = new RegExp(req.body.role, 'i')
    param.real_name = new RegExp(req.body.real_name, 'i')
    param.month = new RegExp(req.body.month, 'i')
    console.log('param',param)
    project = await FormLogModel.find({
        //模糊搜索的字段
        $and: [
            {$or: [{month: {$regex:  param.month}}]},
            {$or: [{role: {$regex:  param.role}}]},
            {$or: [{real_name: {$regex:  param.real_name}}]}
        ]
    }).sort({created_at: -1}).limit(10).skip(page);
    res.status(200).send(
        {
            count:  project.length,
            data: project
        }
    )
}

/**
 * admin--List
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.adminFormList = async (req, res) => {
    const page = parseInt(req.body.p || 0) * 10;
    let kScore = 0
    for(let i of await FormModel.find({formId:req.body._id,name:req.body.name})) {
        kScore =parseFloat(kScore + parseFloat(i['dScore'] || 0))
    }
    const totalScore =parseFloat(100 - parseFloat(kScore))
    // log表存一次
    const item = await FormLogModel.findOne({_id: req.body._id});
    if (item) {
       await item.updateOne({
           totalScore:totalScore
        })
    }
    const count = await FormModel.find({formId:req.body._id,name:req.body.name}).count();
    const result = await FormModel.find({formId:req.body._id,name:req.body.name}).sort({created_at: -1}).limit(10).skip(page);
    res.status(200).send(
        {
            totalScore:totalScore,
            count:count,
            data: result
        }
    )
}


/**
 * admin--rankList 全院评分排名
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.rankList = async (req, res) => {
    // const type = new RegExp(req.body.type, 'i')
    let monthResult = req.body.month || ''
    if(tools.isEmpty(monthResult)){

        // 没传月份默认查当月
        const d = new Date()
        const year = d.getFullYear()
        const month = d.getMonth() + 1
         monthResult = year + '-' + (month < 10 ? `0${month}` : month)
    }

    const param = { month:monthResult}
    if(req.body.type) param.type = req.body.type
    const project = await FormLogModel.find(param);
    // 计算出每个log每个科室的总分
    for(let i of project) {
        let kScore = 0
        for(let j of await FormModel.find({formId:i._id})) {
            kScore =parseFloat(kScore + parseFloat(j['dScore'] || 0))
        }
        i.totalScore =parseFloat(100 - parseFloat(kScore))
    }


    let arr = []
    // 判断是否每个科室是否只有一条数据
    for(let i of [...project]) {
        let lock = false
            for(let j of arr) {
                //相同科室放在一起
                if(i.name === j.name) {
                    if(i.role === j.role) {
                        if(i.role ==='护士长') {
                            j.totalScore = parseFloat((parseFloat(j.totalScore) + parseFloat(i.totalScore))/2)
                            lock = true
                        }
                    }else {
                        if(i.role ==='护士长') {
                            j.htotalScore = i.totalScore
                            j.ntotalScore = j.totalScore

                        }else {
                            j.htotalScore = j.totalScore
                            j.ntotalScore = i.totalScore
                        }
                    }
                    lock = true
                }
            }
            if(!lock)  arr = [...arr,
                {
                    'name':i.name,
                    'month': i.month,
                    'role': i.role,
                    'real_name': i.real_name,
                    'totalScore': i.totalScore,
                    'htotalScore':i.totalScore,
                    'ntotalScore':i.totalScore
                }
            ]

    }
    arr = arr.map(a=>{
        a.htotalScore = parseFloat(a.htotalScore * 0.4).toFixed(2)
        a.ntotalScore = parseFloat(a.ntotalScore * 0.6).toFixed(2)
        a.total =   parseFloat(parseFloat(a.ntotalScore) + parseFloat(a.htotalScore)).toFixed(2)
        return a
    })
    // 不止一条就算平均值
    res.status(200).send(
        {
            count: arr.length,
            data: arr
        }
    )
}
/**
 * 6s排名结果
 * @param req
 * @param res
 * @returns {Promise<void>}
 */

exports.rankResult = async (req,res)=>{
    const name = new RegExp(req.body.name, 'i')
    let monthResult = req.body.month || ''
    if(tools.isEmpty(req.body.month)){
        // 没传月份默认查当月
        const d = new Date()
        const year = d.getFullYear()
        const month = d.getMonth() + 1
        monthResult = year + '-' + (month < 10 ? `0${month}` : month)
    }
    monthResult = new RegExp(monthResult, 'i')
    const project = await FormLogModel.find({
        //模糊搜索的字段
        $and: [
            {$or: [{month: {$regex: monthResult}}]},
            {$or: [{name: {$regex: name}}]}

        ]
    });
    // 计算出每个log每个科室的总分
    for(let i of project) {
        let kScore = 0
        for(let j of await FormModel.find({formId:i._id})) {
            kScore =parseFloat(kScore + parseFloat(j['dScore'] || 0))
        }
        i.totalScore =parseFloat(100 - parseFloat(kScore))
    }


    let arr = []
    // 判断是否每个科室是否只有一条数据
    for(let i of [...project]) {
        let lock = false
        for(let j of arr) {
            //相同科室放在一起
            if(i.name === j.name) {
                if(i.role === j.role) {
                    if(i.role ==='护士长') {
                        j.totalScore = parseFloat((parseFloat(j.totalScore) + parseFloat(i.totalScore))/2)
                        lock = true
                    }
                }else {
                    if(i.role ==='护士长') {
                        j.htotalScore = i.totalScore
                        j.ntotalScore = j.totalScore

                    }else {
                        j.htotalScore = j.totalScore
                        j.ntotalScore = i.totalScore
                    }
                }
                lock = true
            }
        }
        if(!lock)  arr = [...arr,
            {
                'name':i.name,
                'month': i.month,
                'role': i.role,
                'real_name': i.real_name,
                'totalScore': i.totalScore,
                'htotalScore':i.totalScore,
                'ntotalScore':i.totalScore
            }
        ]

    }
    arr = arr.map(a=>{
        a.htotalScore = parseFloat(a.htotalScore * 0.4).toFixed(2)
        a.ntotalScore = parseFloat(a.ntotalScore * 0.6).toFixed(2)
        a.total =   parseFloat(parseFloat(a.ntotalScore) + parseFloat(a.htotalScore)).toFixed(2)
        return a
    })

    // 再去查arr内每个是否有红黄牌登记

    for(let i of arr) {
       const cardResult =  await CardModel.find({name:i.name,month:monthResult});
       if(i.name === '黄牌') {
           //黄牌次数
           i.yCount = cardResult.count
       }else {
           //红牌次数
           i.rCount = cardResult.count
       }
    }
    let finalResult = {
        first:[],
        second:[],
        third:[],
        four:[],
        five:[]
    }
    arr.forEach((a,index)=>{
        //五星级
        if(index === 0 || index === 1) {
                if(a.yCount == '0') {
                    finalResult.five.push(a)
                }
        }
        if(index >= 2 && index <= 7) {
            if(a.rCount == '0') {
                finalResult.four.push(a)
            }
        }
        if(index >= 8 && index <= 25) {
            if(a.rCount == '0') {
                finalResult.third.push(a)
            }
        }
        //计算季度累计黄/红牌张数

        if(index >= 26 && index <= 28) {
            if(a.rCount == '0') {
                finalResult.second.push(a)
            }
        }
        if(index=== 29) {
            if(a.rCount == '0') {
                finalResult.first.push(a)
            }
        }
    })
    res.status(200).send(
        {
            data: finalResult
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
    if (!project) {
        return res.status(202).send({
            message: '数据有误！'
        })
    }
    const result = await project.deleteOne({_id: id})
    res.status(200).send({
        message: '删除成功'
    })
}
/**
 * 删除表单Log
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.formLogDelete = async (req, res) => {
    const id = req.body.id;
    const project = await FormLogModel.findById(id)
    if (!project) {
        return res.status(202).send({
            message: '数据有误！'
        })
    }
    const result = await project.deleteOne({_id: id})
    res.status(200).send({
        message: '删除成功'
    })
}
/**
 * 红黄牌删除
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.cardDelete = async (req, res) => {
    const id = req.body.id;
    const project = await CardModel.findById(id)
    if (!project) {
        return res.status(202).send({
            message: '数据有误！'
        })
    }
    const result = await project.deleteOne({_id: id})
    res.status(200).send({
        message: '删除成功'
    })
}
