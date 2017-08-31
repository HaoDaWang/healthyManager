const mongoose = require('mongoose');

/**
 * 提现管理架构
 */

let withdrawSchema = new mongoose.Schema({
    userName:{type:String},
    telNum:{type:String},
    sum:{ type:Number, default:0},
    poundage:{type:Number,default:0},
    time:{type:Date, default:new Date()},
    method:{type:String},
    withdrawCode:{type:String},
    state:{type:String, default:'审核中'}
})

module.exports = withdrawSchema;