const express = require('express')
const router = express.Router()
const path = require('path')

//手机验证码
let globalValidCode = null;

//模块路径
let modulesPath = require('../config').modulesPath;

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
    console.log(`req.validCode : ${globalValidCode}  obj.validCode : ${obj.validCode}`);
    if(globalValidCode && validCode == globalValidCode){
        //注册
        (async function(){
            let result = await register(obj.userName,obj.passw,obj.telNum,obj.invitTelNum);
            console.log(`result : ${JSON.stringify(result)}`);
            res.json(result);
        })();
    }
    // 验证失败
    else {
        res.json({validErr:'手机验证码错误'})
    }
    
});

//登录
router.post('/login',(req,res) => {
    let login = require(path.join(modulesPath,'loginModule','login'))
    //加密模块
    let crypto = require('crypto');
    const secret = "abcde";
    let cookieID = crypto.createHmac('sha256',secret).update((Date.parse(new Date)).toString()).digest();
    //cookie过期时间 30min
    let cookieMaxAge = 30 * 60 * 1000
    //写入cookie
    res.cookie('cookieID',cookieID.toString(),{maxAge:cookieMaxAge, httpOnly:true})

    let obj = req.body;
    req.session.telNum = obj.telNum;
    console.log(`login: telNum:${obj.telNum} passw:${obj.passw}`);
    (async function(){
        let result = await login(obj.telNum,obj.passw);
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
    let sendValidCode = require(path.join(modulesPath,'validCodeModule','sendValidCode'));
    //返回的json
    let result = null;
    (async function(){
        try{
            let code = await sendValidCode(req.body.telNum);
            globalValidCode = code.code;
            res.json({successful:'发送成功'});
        }
        catch(e){
            console.log('have a err is :' + e)
            res.json({err:e})
        }
    })();
});

//修改密码接口
router.post('/editPassw',(req,res) => {
    let obj = req.body;
    //验证成功
    if(globalValidCode && obj.validCode == globalValidCode){
        //懒加载修改密码模块
        let editPassw = require(path.join(modulesPath,'editPasswModule','editPassw'));
        (async function(){
            let result = await editPassw(obj.telNum,obj.passw);
            res.json(result);
        })();
    }
    //验证失败
    else{
        res.json({err:'验证码错误'});
    }
})

//后台控制主页面
router.get('/backControl',(req,res) => {
    if(!req.session.telNum) res.redirect()

});

//获得所有用户信息
router.get('/getAllUsers',(req,res) => {
    const getAllUsers = require(path.join(modulesPath,'userInfo','getAllUsers'));
    (async function(){
        let result = await getAllUsers();
        res.json(result);
    })();
})

//重置密码
router.post('/resetPassw',(req,res) => {
    const resetPassw = require(path.join(modulesPath,'userInfo','resetPassw'));
    (async function(){
        let result = await resetPassw(req.body.telNum);
        res.json(result);
    })();
})

//查看健康金详情
router.post('/getHealthyMoney',(req,res) => {
    const getHealthyMoney = require(path.join(modulesPath,'userInfo','getHealthyMoney'));
    (async function(){
        let result = await getHealthyMoney(req.body.telNum);
        res.json(result);
    })();
})

//获取下级用户
router.post('/getTeamInform',(req,res) => {
    const getTeamInform = require(path.join(modulesPath,'userInfo','getTeamInform'));
    (async function(){
        let result = await getTeamInform(req.body.telNum);
        res.json(result);
    })();
});

//锁定账号
router.post('/freezeUser',(req,res) => {
    const freezeUser = require(path.join(modulesPath,'userInfo','freezeUser'));
    (async function(){
        let result = await freezeUser(req.body.telNum);
        res.json(result);
    })()
});

//解锁账号
router.post('/unFreezeUser',(req,res) => {
    const unFreezeUser = require(path.join(modulesPath,'userInfo','unFreezeUser'));
    (async function(){
        let result = await unFreezeUser(req.body.telNum);
        res.json(result);
    })()
});

//管理员充值接口
router.post('/moneyStream/adminChangeMoney',(req,res) => {
    let obj = req.body;
    console.log(obj.type);
    if(obj.type == "充值"){
        const adminCharge = require(path.join(modulesPath,'moneyStream','adminChargeMoney'));
        (async function(){
            let result = await adminCharge(obj.telNum,obj.sum);
            res.json(result);
        })();
    }
    else if(obj.type == '扣款'){
        const adminWithdraw = require(path.join(modulesPath,'moneyStream','adminChargeMoney'));
        (async function(){
            let result = await adminWithdraw(obj.telNum,obj.sum);
            res.json(result);
        })();
    }
    else{
        res.json({err:'请输入正确的类型'});
    }
})

//能获取指定人的信息
router.post('/getUser',(req,res) => {
    const getUser = require(path.join(modulesPath,'userInfo','getUser'));
    (async function(){
        let result = await getUser(req.body.telNum);
        res.json(result)
    })();
})

router.get('/remove',(req,res) => {
    const removeImg = require(path.join(modulesPath,'charges','removeImg'));
    (async function(){
       let result = await removeImg();
       res.json(result);
    })();
});



module.exports = router