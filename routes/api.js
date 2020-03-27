var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController')
const miniprogramController = require('../controllers/miniprogramController')
const adminController = require('../controllers/adminController')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});




/* admin. */
router.post('/admin/test', adminController.test)
router.post('/admin/login', adminController.login)


/* miniprogram. */
router.post('/mini/test', miniprogramController.test)


module.exports = router;
