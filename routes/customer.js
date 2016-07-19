var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
});
var upload = multer({
    storage: storage
});

// 特针对于该路由的中间件
router.use(function log(req, res, next) {
  console.log('Msg : ', '我是中间件...');
  console.log('Time: ', Date.now());
  next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('customer/index');
});

// router.get('/upload', checkLogin);
router.get('/upload', function (req, res) {
  res.render('customer/upload');
});

// router.post('/upload', checkLogin);
router.post('/upload', upload.array('upload', 5), function (req, res) {
  req.flash('success', '文件上传成功!');
  res.redirect('/upload');
});

router.get('/login', function(req, res, next) {
  res.render('customer/login');
});

router.post('/login', function (req, res) {

  console.log("req.session --> " + req.session);

  var acc = req.body.acc,
      pwd = req.body.pwd;

  console.log("acc --> " + acc);
  console.log("pwd --> " + pwd);

  var AccountModel = require('./../models/Account.js');
  AccountModel.findOne({name: acc,pwd: pwd},function(err,doc){
    if(err) throw err;
    req.session.user = doc;
    res.render('customer/home',{ name: doc.name });
  });


});

router.get('/home', function(req, res, next) {
  res.render('customer/home');
});

router.get('/reg', function(req, res, next) {
  res.render('customer/reg');
});

router.post('/reg', function (req, res) {

  var acc = req.body.acc,
      pwd = req.body.pwd,
      pwd_r = req.body.pwd_r;

  //检验用户两次输入的密码是否一致
  if (pwd_r != pwd) {
    console.log('两次输入的密码不一致!');
    req.flash('error', '两次输入的密码不一致!');
    return res.redirect('reg');
  }
  // 生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      pwdMD5 = md5.update(req.body['pwd']).digest('hex');

  var AccountModel = require('./../models/Account.js');
  var account = new AccountModel({
      name: acc,
      pwd: pwdMD5
  });
  console.log(account);
  account.save(function(err,doc){
    if(err) throw err;
    res.render('customer/home',{ name: doc.name });
  });
});

exports.doAddAccount = function(req, res) {
  res.send({'success':true});
};

module.exports = router;
