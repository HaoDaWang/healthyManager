var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//路由模块
var routerManager = require('./routes/routerManager');
var chargeManager = require('./routes/chargeManager');
var withdrawManager = require('./routes/withdrawManager')

var app = express();

//设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//解析json中间件
app.use(bodyParser.json());
//解析post数据
app.use(bodyParser.urlencoded({ extended: false }));
//解析cookie中间件
app.use(cookieParser());
//设置静态目录
app.use(express.static(path.join(__dirname, 'public')));
//session
app.use(session({
    secret:"zzh",
    resave:false,
    cookie:{
        maxAge:30 * 60 * 1000
    }
}))

//CORS跨域
app.all("*",(req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})

//拦截提现页面
app.use('/withdrawManager',withdrawManager);
//拦截充值管理页面
app.use('/chargeManager',chargeManager);
//拦截所有路由
app.use('/', routerManager);

// 未找到页面 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 服务器内部错误 抛出500
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//捕获未捕获的promise异常
process.on('unhandledRejection',(reason,p) => {
    console.log(JSON.stringify(reason));
})

module.exports = app;
