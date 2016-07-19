// 加载依赖库，原来这个类库都封装在connect中，现在需地注单独加载
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io = require('socket.io');

// 加载路由控制
var index = require('./routes/index');
var customer = require('./routes/customer');

var chat = require('./routes/chat');

var flash = require('connect-flash');

var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);
// var mongodb = require('./models/mongodb');
// var mongoose = mongodb.mongoose;

var RedisStore = require('connect-redis')(session);

// 创建项目实例
var app = express();

// view engine setup
// 定义EJS模板引擎和模板文件位置，也可以使用jade或其他模型引擎
app.set('views', path.join(__dirname, 'views'));//设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录。
app.set('view engine', 'ejs');//设置视图模板引擎为 ejs。

app.use(flash());

// uncomment after placing your favicon in /public
// 定义icon图标
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));//设置/public/favicon.ico为favicon图标。
// 定义日志和输出级别
app.use(logger('dev'));//加载日志中间件。
// 定义数据解析器
app.use(bodyParser.json());//加载解析json的中间件。
app.use(bodyParser.urlencoded({ extended: false }));//加载解析urlencoded请求体的中间件。
// 定义cookie解析器
app.use(cookieParser());//加载解析cookie的中间件。
// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));//设置public文件夹为存放静态文件的目录。

// app.use(session({
//     secret: 'mongodbSession',
//     cookie: { secure: false },
//     store: new MongoStore({
//         mongooseConnection: mongoose.connection,
//         ttl: 1000 * 60 * 60 * 24
//       }),
//     resave: true,
//     saveUninitialized: true
// }));


app.use(session({
    secret: 'redisSession',
    store: new RedisStore({
      host: '127.0.0.1',
      port: '6379',
      ttl: 1000 * 60 * 60 * 24
    }),
    resave: true,
    saveUninitialized: true
}));

// 匹配路径和路由
app.use('/', index);
app.use('/customer', customer);

app.use('/chat', chat);

// catch 404 and forward to error handler
// 捕获404错误，并转发到错误处理器。
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
// 开发环境，500错误处理和错误堆栈跟踪
// 开发环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中。
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
// 生产环境，500错误处理,生产环境下的错误处理器，不会将错误信息泄露给用户。
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.ready=function(server){
  chat.prepareSocketIO(server);
};

// 输出模型app
module.exports = app;
