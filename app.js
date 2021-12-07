var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var jwt = require('jsonwebtoken')
require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var mongoose = require('./config/dbConfig');
var db = mongoose.connection;//异步连接数据库

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var AdminModel = require('./schema/adminSchema')

//跨域
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



//前台
app.use('/' , express.static(path.join(__dirname, 'client/dist')));
//后台管理页面
app.use('/admin' , express.static(path.join(__dirname, 'admin')));//访问静态资源

//连接数据库
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('数据库连接成功！')
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/scrapy/api',apiRouter)

app.use('/api', async (req, res, next) => {
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
    await next()
},apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
