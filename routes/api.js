var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController')
const miniprogramController = require('../controllers/miniprogramController')
const adminController = require('../controllers/adminController')
const projectController = require('../controllers/projectController')
const scrapyContraller = require('../controllers/scrapyController')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



/* admin. */
router.post('/admin/test', adminController.test)
router.post('/admin/login', adminController.login)
router.post('/admin/changePassword', adminController.changePassword)
router.post('/admin/adminList', adminController.adminList)
router.post('/admin/addNewAdmin', adminController.register)
router.post('/admin/deleteAdmin', adminController.deleteAdmin)
router.post('/admin/getUploadToken', adminController.getToken)


router.post('/admin/role/add', adminController.addRole)
router.post('/admin/role/delete', adminController.delRole)
router.post('/admin/role/list', adminController.roleList)

/* miniprogram. */
router.post('/mini/test', miniprogramController.test)
router.post('/mini/login', miniprogramController.getCode)
// 爬虫
router.post('/main', scrapyContraller.index)

// 业务端
router.post('/admin/project/type/add', projectController.typeAdd)
router.post('/admin/project/type/list', projectController.typeList)
router.post('/admin/project/type/list/all', projectController.typeListAll)
router.post('/admin/project/type/delete', projectController.typeDelete)
router.post('/admin/project/depart/list', projectController.projectList)
router.post('/admin/project/depart/all', projectController.projectAllList)
router.post('/admin/project/depart/add', projectController.projectAdd)
router.post('/admin/project/depart/delete', projectController.projectDelete)
router.post('/admin/project/option/list', projectController.getOption)
router.post('/admin/project/score/list', projectController.scoreList)
router.post('/admin/project/score/add', projectController.scoreAdd)
router.post('/admin/project/score/delete', projectController.scoreDelete)
router.post('/admin/project/form/log/list', projectController.adminFormLogList)
router.post('/admin/project/form/list', projectController.adminFormList)
router.post('/admin/project/form/delete', projectController.formDelete)
router.post('/admin/project/form/log/delete', projectController.formLogDelete)
router.post('/admin/project/card/add', projectController.cardAdd)
router.post('/admin/project/card/list', projectController.cardList)
router.post('/admin/project/card/delete', projectController.cardDelete)
router.post('/admin/project/rank/list', projectController.rankList)
router.post('/admin/project/rank/result', projectController.rankResult)
router.post('/admin/project/export/excel', projectController.onExportExcel)
/* h5. */
router.post('/h5/project/form/add', projectController.formAdd)
router.post('/h5/project/form/list', projectController.formList)
router.post('/h5/project/form/log/list', projectController.formLogList)
router.post('/h5/project/form/delete', projectController.formDelete)
router.post('/h5/project/score/list', projectController.h5scoreList)
router.post('/h5/project/depart/list', projectController.departH5List)
module.exports = router;
