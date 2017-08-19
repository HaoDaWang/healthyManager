const mongoose = require('mongoose');

/**
 * 管理员集合
 */

//创建数据架构
let adminSchema = new mongoose.Schema({
    telNum:{ type:String },
    passw:{ type:String }
});

module.exports = adminSchema;