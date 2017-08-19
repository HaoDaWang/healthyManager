const mongoose = require('mongoose');

//数据库URL
const dataBaseURl = 'mongodb://localhost:27017/healthyManager';

//连接数据库
let db = mongoose.createConnection(dataBaseURl);

//连接成功回调
db.on('connected',() => {
    console.log('connect mongo data base successful!');
})

//连接断开回调
db.on('disconnected',() => {
    console.log('mongodb is disconneted');
})

//错误回调
db.on('error',err => {
    console.log('connect mongodb hava a error is' + JSON.stringify(err));
})

//导出db对象
module.exports = db;