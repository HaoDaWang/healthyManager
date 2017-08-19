const express = require('express')
const router = express.Router()
const path = require('path')

//模块路径
let modulesPath = '../modules'

//重定向到首页
router.get('/',(req,res) => {
    res.redirect('/index.html')
})

//注册
router.post('/registe',(req,res) => {
    let register = require(path.join(modulesPath,'registerModule','register'))
    let obj = req.body.values
    register(obj,obj,obj,obj);//TODO
});

module.exports = router