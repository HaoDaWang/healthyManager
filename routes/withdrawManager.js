const express = require('express');
const router = express.Router();
const path = require('path');

//模块路径
const modulesPath = require('../config').modulesPath;
const withdrawPath = path.join(modulesPath,"withdraw");
const chargePath = path.join(modulesPath,"charges");

//提交提现申请图片
let multer = require('multer');
let storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'./public/images')
    },
    filename:(req,file,cb) => {
        cb(null,file.fieldname + Date.now() + '.jpg')
    }
});
let upload = multer({storage:storage})
router.post('/uploadWithdrawImg',upload.single('withdrawImg'),(req,res) => {
    let baseImgPath = "http://localhost:3000/images"; 
    let imgPath = baseImgPath + req.file.filename;
    req.session.imgPath = imgPath;
    let obj = req.body;
    console.log(withdrawPath);
    //
    const uploadWithdraw = require(path.join(withdrawPath,'uploadWithdraw'));
    (async function(){
        let result = await uploadWithdraw(imgPath, obj.telNum, obj.method);
        res.json(result);
    })();
})

//提交提现信息
router.post('/putWithdraw',(req,res) => {
    let obj = req.body;
    const putWithdraw = require(path.join(withdrawPath,'putWithdraw'));
    (async function(){
        console.log("aaaaaaaaaaaaa")
        let result = await putWithdraw(obj.telNum, obj.sum, obj.method, obj.withdrawCode);
        res.json(result);
    })();
})

// TODO----------------------------------------------
//全部通过
router.post('/allPass',(req,res) => {
    const removeAllCharge = require(path.join(chargePath,"removeAllCharge"));
    const removeImg = require(path.join(chargePath,'removeImg'));
    const withdrawModel = require(path.join(modulesPath,'mongooseModule','model','withdrawModel'));
    (async function(){
        //删除图片
        let reomoveResult = await removeImg(withdrawModel, undefined, 'withdrawModel');
        console.log('out')
        //充值
        let result = await removeAllCharge(withdrawModel, true, 'withdrawModel');
        res.json(result);
    })();
})

//全部驳回
router.post('/allReject',(req,res) => {
    const withdrawModel = require(path.join(modulesPath,'mongooseModule','model','withdrawModel'));
    const removeAllCharge = require(path.join(chargePath,"removeAllCharge"));
    const removeImg = require(path.join(chargePath,'removeImg'));
    (async function(){
        //删除图片
        let reomoveResult = await removeImg(withdrawModel, undefined, 'withdrawModel');
        //充值
        let result = await removeAllCharge(withdrawModel, false, 'withdrawModel');
        res.json(result);
    })();
})

//选择驳回
router.post('/selectReject',(req,res) => {
    const withdrawModel = require(path.join(modulesPath,'mongooseModule','model','withdrawModel'));
    const selectPass = require(path.join(chargePath,'selectPass'));
    const removeImg = require(path.join(chargePath,'removeImg'));
    let obj = req.body;
    let temp = obj['telNumArray[]'];
    let telNumArray;
    //判断是否为字符串
    if(Object.prototype.toString.call(temp) == '[object String]'){
        telNumArray = [];
        telNumArray.push(temp);
    }
    //为一个数组
    else{
        telNumArray = temp;
    }
    (async function(){
        //删除图片
        let reomoveResult = await removeImg(withdrawModel,obj.telNumArray,'withdrawModel');
        let result = await selectPass(withdrawModel,obj.telNumArray,false,'withdrawModel');
        res.json(result)
    })();
})

//选择通过
router.post('/selectPass',(req,res) => {
    const withdrawModel = require(path.join(modulesPath,'mongooseModule','model','withdrawModel'));
    const selectPass = require(path.join(chargePath,'selectPass'));
    const removeImg = require(path.join(chargePath,'removeImg'));
    let obj = req.body;
    let temp = obj['telNumArray[]'];
    let telNumArray;
    //判断是否为字符串
    if(Object.prototype.toString.call(temp) == '[object String]'){
        telNumArray = [];
        telNumArray.push(temp);
    }
    //为一个数组
    else{
        telNumArray = temp;
    }
    console.log(telNumArray)
    // let telNumArray = [req]
    console.log(req.body);
    (async function(){
        //删除图片
        let reomoveResult = await removeImg(withdrawModel,telNumArray,'withdrawModel');
        let result = await selectPass(withdrawModel,telNumArray,true,'withdrawModel',obj.poundage);
        res.json(result)
    })();
})

module.exports = router;