const mongoose = require('mongoose');

/**
 * 投资大盘数据架构
 */

let prizeSchema = new mongoose.Schema({
    totalMoney:{type:Number,default:0},
    expectMoney:{type:Number,default:0},
    index:{type:Number,default:1},
    exponent:{type:Number,default:0.55},
    ectualExponent:{type:Number,default:0.055},
    expectExponent:{type:Number , default:0.11},
    users:{type:Array,default:[],unique:true}
});

module.exports = prizeSchema;