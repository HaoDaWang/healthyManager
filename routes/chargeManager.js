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
    let baseImgPath = "http://localhost:3000/images/"; 
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
    (async function(){
        //删除图片
        let reomoveResult = await removeImg();
        //充值
        let result = await removeAllCharge(true);
        res.json(result);
    })();
})

//全部驳回
router.post('/allReject',(req,res) => {
    const removeAllCharge = require(path.join(chargePath,"removeAllCharge"));
    const removeImg = require(path.join(chargePath,'removeImg'));
    (async function(){
        //删除图片
        let reomoveResult = await removeImg();
        //充值
        let result = await removeAllCharge(false);
        res.json(result);
    })();
})

//选择驳回
router.post('/selectReject',(req,res) => {
    const selectPass = require(path.join(chargePath,'selectPass'));
    const removeImg = require(path.join(chargePath,'removeImg'));
    let obj = req.body;
    (async function(){
        //删除图片
        let reomoveResult = await removeImg(obj.telNumArray);
        let result = await selectPass(obj.telNumArray,false);
        res.json(result)
    })();
})

//选择通过
router.post('/selectPass',(req,res) => {
    const selectPass = require(path.join(chargePath,'selectPass'));
    const removeImg = require(path.join(chargePath,'removeImg'));
    let obj = req.body;
    let temp = obj['telNumArray[]'];
    let telNumArray;
    if(Object.prototype.toString.call(temp) == '[object String]'){
        telNumArray = [];
        telNumArray.push(temp);
    }
    else{
        telNumArray = temp;
    }
    console.log(req.body);
    (async function(){
        //删除图片
        let reomoveResult = await removeImg(telNumArray);
        let result = await selectPass(telNumArray,true);
        res.json(result)
    })();
})
module.exports = router;