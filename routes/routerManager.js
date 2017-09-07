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
    // if(globalValidCode && validCode == globalValidCode){
        //注册
        (async function(){
            let result = await register(obj.userName,obj.passw,obj.telNum,obj.invitTelNum);
            console.log(`result : ${JSON.stringify(result)}`);
            res.json(result);
        })();
    // }
    // 验证失败
    // else {
        // res.json({validErr:'手机验证码错误'})
    // }
    
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
    const judgeVIP = require(path.join(modulesPath,'moneyStream','judgeVIP'));
    (async function(){
        let updateResult = await judgeVIP();
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
        const adminWithdraw = require(path.join(modulesPath,'moneyStream','adminWithdrawMoney'));
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
router.get('/getUser/:telNum',(req,res) => {
    console.log(req.params);
    const getUser = require(path.join(modulesPath,'userInfo','getUser'));
    const judgeVIP = require(path.join(modulesPath,'moneyStream','judgeVIP'));
    (async function(){
        //更新指定用户的钻卡什么卡的信息
        let updateResult = await judgeVIP(req.params.telNum);
        if(updateResult.err){
            res.json(updateResult);
        }
        else{
            let result = await getUser(req.params.telNum);
            res.json(result)   
        }
    })();
})


//转换健康金
router.post('/transferHealthMoney',(req,res) => {
    //手机号 健康金类型 充值健康金金额 
    const chargeMoney = require(path.join(modulesPath,'moneyStream','chargeMoney'));
    const adminWithdrawMoney = require(path.join(modulesPath,'moneyStream','adminWithdrawMoney'));
    const getThreeInvitTelNum = require(path.join(modulesPath,'userInfo','getThreeInvitTelNum'));
    const judgeTeam = require(path.join(modulesPath,'userInfo','judgeTeam'));
    const consumeMoney = require(path.join(modulesPath,'moneyStream','consumeMoney'));
    
    let obj = req.body;
    //只能转换为流通健康金
    if(!obj.type){
        obj.type = 'ltjkj';
    }
    //需要扣款的数目
    console.log('sum---------------'+obj.sum);
    //判断是否购买的是套餐
    let resultMoney = 0;
    switch(obj.sum){
        case 1818.18://100
            resultMoney = 100;
            break;
        case 5454.55://300
            resultMoney = 300;
            break;
        case 12727.27://700
            resultMoney = 700;
            break;
        case 27272.73://1200
            resultMoney = 1200;
            break;
        case 56363.64://3100
            resultMoney = 3100;
            break;
        case 114545.46://6300
            resultMoney = 6300;
            break;
        default:
            withdrawMoney = (parseFloat(obj.sum) * parseFloat(0.055)).toFixed(2);
            break;
    }

    console.log("width ------------------" + withdrawMoney);
    (async function(){
        let adminWithdrawMoneyResult = await adminWithdrawMoney(obj.telNum,withdrawMoney);
        if(adminWithdrawMoneyResult.err){
            res.json(adminWithdrawMoneyResult)
        }
        else{
            //记录消费金额
            //let consumeMoneyResult = await consumeMoney(obj.telNum, withdrawMoney);
            let result = await chargeMoney(obj.telNum,obj.sum,obj.type);
            if(result.err){
                res.json(result);
            }
            else {
                //查询三级上家返回一个数组
                //let invitTelNumArr = await getThreeInvitTelNum(obj.telNum);
                // console.log(invitTelNumArr.successful)
                //查询更新三个上家的下家奖励
                //for(let val of invitTelNumArr.successful){
                   //let r =  await judgeTeam(val, withdrawMoney);
                   //console.log(r);
                //}
                res.json(result);
            }
        }
    })();
})

//判断更新等级
router.post('/judgeVIP',(req,res) => {
    const judgeVIP = require(path.join(modulesPath,'moneyStream','judgeLevel'));
    (async function(){
       let result = await judgeVIP(req.body.telNum);
       res.json(result);
    })();
})

//分页
router.post('/limitPage',(req,res) => {
    let obj = req.body;
    let pageCount = parseInt(obj.pageCount);
    let page = parseInt(obj.page);
    let skip = (page-1) * pageCount;
    const limitPage = require(path.join(modulesPath,'userInfo','limitPage'));
    (async function(){
       let result = await limitPage(skip,pageCount);
       res.json(result);
    })();
})

router.get('/remove',(req,res) => {
    const removeImg = require(path.join(modulesPath,'charges','removeImg'));
    (async function(){
       let result = await removeImg();
       res.json(result);
    })();
});

//购买健康金
//手机号 购买健康金的等级
router.post('/buyService',(req,res) => {
    let obj = req.body;
    const buyService = require(path.join(modulesPath,'icp','buyService'));
    (async function(){
        let result = await buyService(obj.telNum,obj.service);
        res.json(result);
    })();
})

//获取销量数据
router.get('/getConsume',(req,res) => {
    const getSales = require(path.join(modulesPath,'icp','getSales'));
    (async function(){
        let result = await getSales();
        res.json(result);
    })();
});

//使者动态收益
router.get('/icpIncome',(req,res) => {
    const getIcpIncome = require(path.join(modulesPath,'icp','judgePromote'));
    (async function(){
        let judgeResult = await getIcpIncome.judgePromote();
        let dataResult = await getIcpIncome.getPromoteData();
        res.json(dataResult);
    })();
});

//使者团队收益
router.get('/getAchievement',(req,res) => {
    const getAchievement = require(path.join(modulesPath,'icp','getAchievement'));
    (async function(){
        let result = await getAchievement();
        res.json(result);
    })();
})

//修改预售金额
router.post('/editExpectMoney',(req,res) => {
    const editExpectMoney = require(path.join(modulesPath,'prize','editExpectMoney'));
    let obj = req.body;
    (async function(){
        let result = await editExpectMoney(obj.expectMoney);
        res.json(result);
    })();
});

//上传用户头像
let multer = require('multer');
let storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'./public/images')
    },
    filename:(req,file,cb) => {
        cb(null,file.fieldname  + '.jpg')
    }
});
let upload = multer({storage:storage})
router.post('/uploadHeadImg',upload.single('chargeImg'),(req,res) => {
    let baseImgPath = "http://localhost:3000/images"; 
    let imgPath = baseImgPath + req.file.filename;
    req.session.imgPath = imgPath;
    let obj = req.body;
    const uploadHeadImg = require(path.join(path.join(modulesPath,'userInfo','uploadHeadImg')));
    (async function(){
        let result = await uploadHeadImg(imgPath,obj.telNum);
        res.json(result);
    })();
})

//上传用户信息
//开户信息 银行卡号 身份证号 性别 昵称
router.post('/putUserInfo',(req,res) => {
    let obj = req.body;
    const putUserInfo = require('../userInfo/putUserInfo');
    (async function(){
        let result = await putUserInfo(obj.telNum, obj.userName, obj.sex, obj.IDNum, obj.BankCardNum, obj.openingBank);
        res.json(result);
    })();
});

module.exports = router