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
    let sortData = [] //排序数组
    for(let i in obj) {
        let score = 0
        for(let j of obj[i]) {
            score = parseFloat(score + parseFloat(j['dScore']))
        }
        obj[i+'_total'] = parseFloat(100 - score)
        sortData = [...sortData,{name:i,value:parseFloat(100 - score)}]

    }
    sortData.sort((obj1,obj2)=>{
        const val1 = obj1.value;
        const val2 = obj2.value;
        if (val1 > val2) {
            return -1;
        } else if (val1 < val2) {
            return 1;
        } else {
            return 0;
        }
    })
    for(let i of sortData) {
        arr = [...arr,...obj[i.name]]
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
    // const monthResult = getDate('','month')
    const monthResult = '2022-01'
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
        //
            const isSubmitData = await FormModel.find({name:req.body.name,month:monthResult,role:req.body.role});
            if(isSubmitData.length > 0 ) {
                //是否同一天
                if( getDate('','date') !== getDate(isSubmitData[0].created_at,'date')){
                    //不是同一天  护士长可以2次 内控员只有一次
                    if(req.body.role !== '护士长') {
                        // 同一科室不同的日期
                            return res.status(500).send({
                                message: '您本月已提交过该科室的评分表了'
                            })
                    }else {
                        // 同一科室 是否有多条不同的日期

                        const dateArr = [...new Set(isSubmitData.map(a=>getDate(a.created_at,'date')))]
                        console.log('dateArr',dateArr)
                        // 当月仅可提交两次
                        if(dateArr.length >= 2) {
                            if(!dateArr.includes(getDate('','date'))){
                                return res.status(500).send({
                                    message: '您本月已提交过该科室的评分表了'
                                })
                            }
                        }else if(dateArr.length === 1){
                            // 且不是同一天
                            const result3 = await FormLogModel.create({
                                userId:req.body.userId,
                                name: req.body.name,
                                month:monthResult,
                                role: req.body.role || '-',
                                real_name: req.body.real_name || '-'
                            })
                            formId = result3._id
                        }else {
                            //有记录后就ID就是这条记录的_id
                            formId = logResult[0]._id
                        }
                    }
                }else {
                    //有记录后就ID就是这条记录的_id
                    formId = logResult[0]._id
                }
            }else {
                //有记录后就ID就是这条记录的_id
                formId = logResult[0]._id
            }

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
        userId:req.body.userId,
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
    const result = await FormModel.find({userId:req.body.userId}).sort({created_at: -1});
    console.log('userId',req.body.userId)
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
    if(!tools.isEmpty(req.body.type)) param.type = req.body.type
    const depart  = await projectModel.find();
    const departName =[...new Set(depart.map(a=>a.name))]

    const project = await FormLogModel.find(param);
    let arrResult = {}
    const formList = []
    let index = 0

    // 构造分科室的数据
    for(let i of project) {
        index++
        const form = await FormModel.find({formId:i._id});
        formList.push(form)
        const key = i.role+'_'+index
        arrResult[key] = {}
        for(let j of departName) {
            arrResult[key][j] = form.filter(a=>a.name === j)
        }
    }
    let finalResult = {}
    for(let i in arrResult) {
        finalResult[i] = []
        for(let j of departName) {
            let obj= {}
            if(arrResult[i][j].length > 0) {
                let score = 0;
                for(let k of arrResult[i][j]) {
                    score = parseFloat(score + parseFloat(k['dScore']))
                    obj['name'] = j
                    obj['value'] = parseFloat(100 - score)
                }
                finalResult[i].push(obj)
            }else {
                obj['name'] = j
                obj['value'] =100
                finalResult[i].push(obj)
            }
        }
    }
    let data = []
    for(let i of departName) {
        let nTotal = ''
        let hTotal = ''
        for(let j in finalResult) {
            const jName = j.split('_')[0]
            if(jName === '内控员') {

                nTotal = finalResult[j].filter(a=>a.name === i)[0].value
            }else {
                for(let h in finalResult) {
                    const hName = h.split('_')[0]
                    if(hName !== '内控员' && h !== j) {
                        if(!tools.isEmpty(finalResult[h])){
                            console.log('护士长',finalResult[h])
                            hTotal = parseFloat(finalResult[j].filter(a=>a.name === i)[0].value + finalResult[h].filter(a=>a.name === i)[0].value) / 2
                        }else {
                            hTotal = finalResult[j].filter(a=>a.name === i)[0].value
                        }
                    }
                }
            }
        }
        data.push({
            name:i,
            nTotal:parseFloat(nTotal * 0.4).toFixed(2),
            hTotal:parseFloat(hTotal * 0.6).toFixed(2),
            total:parseFloat(parseFloat(nTotal * 0.4) + parseFloat(hTotal * 0.6)).toFixed(2)
        })
    }
    data.sort((obj1,obj2)=>{
        const val1 = parseFloat(obj1.total);
        const val2 = parseFloat(obj2.total);
        if (val1 > val2) {
            return -1;
        } else if (val1 < val2) {
            return 1;
        } else {
            return 0;
        }
    })
    res.status(200).send(
        {
            finalResult:finalResult,
             data: data
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
