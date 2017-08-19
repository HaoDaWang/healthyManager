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
    //注册
    (async function(){
        let result = await register(obj.userName,obj.passw,obj.telNum,obj.invitTelNum);
        res.json(result);
    })();
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
    //做result判断是否存在 TODO
    //
})

//发送验证码接口
router.post('/getValidCode',(req,res) => {
    
});

//充值接口
router.post('/moneyStream/charge',(req,res) => {
    
});

//扣款接口
router.post('/moneyStream/reduce',(req,res) => {

})


module.exports = router