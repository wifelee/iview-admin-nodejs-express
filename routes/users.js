var express = require('express');
var router = express.Router();
/**
 * 相应的controller
 */
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const miniprogramController = require('../controllers/miniprogramController')


router.get('/', userController.add);

/**
 * 后台登录 注册
 */
router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.post('/h5/login', adminController.h5login);
router.post('/getSms', adminController.getSms);
/**
 * 小程序登录
 */
router.post('/mini/login', miniprogramController.getCode);
router.post('/mini/saveUserInfo', miniprogramController.saveUserInfo);
router.post('/mini/getUserInfo', miniprogramController.getUserInfo);
router.post('/mini/addHomework', miniprogramController.addHomework);
router.post('/mini/getHomework', miniprogramController.getHomework);
router.post('/mini/submitHomework', miniprogramController.submitHomework);
module.exports = router;
