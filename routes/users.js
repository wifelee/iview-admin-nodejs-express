var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
/* GET users listing. */

router.get('/', userController.add);

/**
 * 后台登录 注册
 */
router.post('/register', adminController.register);
router.post('/login', adminController.login);


module.exports = router;
