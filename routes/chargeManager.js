const express = require('express');
const router = express.Router();
const path = require('path');

//模块路径
const modulesPath = require('../config').modulesPath;
const chargePath = path.join(modulesPath,"charges");
const basePath = '/chargeManager';

//获取所有用户信息
router.get('/getAllCharge',(req,res) => {
    let getAllCharge = require(path.join(chargePath,"getAllCharge"));
    (async function(){
        let result = await getAllCharge();
        res.json(result);
    })();
})

//提交充值申请图片
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
router.post('/uploadChargeImg',upload.single('chargeImg'),(req,res) => {
    let baseImgPath = "http://localhost:3000/images"; 
    let imgPath = baseImgPath + req.file.filename;
    req.session.imgPath = imgPath;
    let obj = req.body;
    const uploadCharge = require(path.join(chargePath,"uploadCharge"));
    (async function(){
        let result = await uploadCharge(imgPath,obj.telNum);
        res.json(result);
    })();
})

//提交充值申请
router.post('/putCharge',(req,res) => {
    const putCharge = require(path.join(chargePath,"putCharge"));
    let obj = req.body;
    console.log('req.session.imgPath' + req.session.imgPath);
    (async function(){
        let result = await putCharge(obj.telNum,obj.sum,req.session.imgPath);
        res.json(result);
    })();
})

//全部通过
router.post('/allPass',(req,res) => {
    const removeAllCharge = require(path.join(chargePath,"removeAllCharge"));
    const removeImg = require(path.join(chargePath,'removeImg'));
    const chargeModel = require(path.join(modulesPath,'mongooseModule','model','chargeModel'));
    (async function(){
        //删除图片
        let reomoveResult = await removeImg(chargeModel, undefined, 'chargeModel');
        //充值
        let result = await removeAllCharge(chargeModel, true, 'chargeModel');
        res.json(result);
    })();
})

//全部驳回
router.post('/allReject',(req,res) => {
    const chargeModel = require(path.join(modulesPath,'mongooseModule','model','chargeModel'));
    const removeAllCharge = require(path.join(chargePath,"removeAllCharge"));
    const removeImg = require(path.join(chargePath,'removeImg'));
    (async function(){
        //删除图片
        let reomoveResult = await removeImg(chargeModel, undefined, 'chargeModel');
        //充值
        let result = await removeAllCharge(chargeModel, false, 'chargeModel');
        res.json(result);
    })();
})

//选择驳回
router.post('/selectReject',(req,res) => {
    const chargeModel = require(path.join(modulesPath,'mongooseModule','model','chargeModel'));
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
        let reomoveResult = await removeImg(chargeModel,telNumArray,'chargeModel');
        let result = await selectPass(chargeModel,telNumArray,false,'chargeModel');
        res.json(result)
    })();
})

//选择通过
router.post('/selectPass',(req,res) => {
    const chargeModel = require(path.join(modulesPath,'mongooseModule','model','chargeModel'));
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
    console.log(req.body);
    (async function(){
        //删除图片
        let reomoveResult = await removeImg(chargeModel,telNumArray,'chargeModel');
        let result = await selectPass(chargeModel,telNumArray,true,'chargeModel');
        res.json(result)
    })();
})

//搜索
router.post('/chargeSearch',(req,res) => {
    const search = require(path.join(modulesPath,'userInfo','search'));
    let obj = req.body;
    console.log(req.body.start);
    (async function(){
       let result = await search(obj.telNum,obj.userName,obj.start,obj.end);
       res.json(result);
    })();
})

//导出xls
router.get('/chargeExportXLS',(req,res) => {
    const chargeExportXLS = require(path.join(chargePath,'chargeExportXLS'));
    (async function(){
        let result = await chargeExportXLS();
        res.attachment('充值表.xls')
        res.end(result,'binary');
    })();
})


module.exports = router;