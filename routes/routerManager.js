const express = require('express')
const router = express.Router()
const path = require('path')

//CORS跨域
router.all("*",(req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})

//模块路径
let modulesPath = '../modules'

//重定向到首页
router.get('/',(req,res) => {
    res.redirect('/index.html')
})

//注册
router.post('/registe',(req,res) => {
    //模块懒加载
    let register = require(path.join(modulesPath,'registerModule','register'));
    let obj = req.body;
    //验证码验证
    let validCode = obj.validCode;
    if(req.validCode && validCode == req.validCode){
        //注册
        (async function(){
            let result = await register(obj.userName,obj.passw,obj.telNum,obj.invitTelNum);
            res.json(result);
        })();
    }
    //验证失败
    else {
        res.json({validErr:'手机验证码错误'})
    }
    
});

//登录
router.post('/login',(req,res) => {
    let login = require(path.join(modulesPath,'loginModule','login'))
    let obj = req.body;
    console.log(`telNum:${obj.telNum} passw:${obj.passw}`);
    (async function(){
        let result = await adminLogin(obj.telNum,obj.passw);
        if(result.successful){
            if(result.successful.length == 0) res.json({err:'账号密码不符'});
        }
        res.json(result);
    })();
})

//管理员登录
router.post('/adminLogin',(req,res) => {
    let adminLogin = require(path.join(modulesPath,'loginModule','adminLogin'))
    let obj = req.body;
    console.log(`telNum:${obj.telNum} passw:${obj.passw}`);
    (async function(){
        let result = await adminLogin(obj.telNum,obj.passw);
        if(result.successful){
            if(result.successful.length == 0) res.json({err:'账号密码不符'});
        }
        res.json(result);
    })();
})

//发送验证码接口
router.post('/getValidCode',(req,res) => {
    let createValid = require(path.join(modulesPath,'validCodeModule','createValidCode'));
    let code = createValid()
    req.validCode = code
    const SMSClient = require('@alicloud/sms-sdk/index');
    const accessKeyId = 'LTAI4wvnYRtFekNN'
    const secretAccessKey = 'KQCtiOnkBwo8rY1zsLJUu27vkldgET'
    let smsClient = new SMSClient({accessKeyId,secretAccessKey});
    //发送短信
    smsClient.sendSMS({
        PhoneNumbers: req.body.telNum + '',
        SignName: '健康精灵',
        TemplateCode: 'SMS_86690107',
        TemplateParam: '{"validCode":"'+code+'"}'
    }).then(function (res) {
        let {Code}=res
        if (Code === 'OK') {
            //处理返回参数
            console.log(res)
            res.json({successful:'验证码发送成功'})
        }
    }, function (err) {
        console.log(err)
    })
});

//充值接口
router.post('/moneyStream/charge',(req,res) => {
    
});

//扣款接口
router.post('/moneyStream/reduce',(req,res) => {

})


module.exports = router