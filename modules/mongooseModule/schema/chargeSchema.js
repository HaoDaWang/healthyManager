const mongoose = require('mongoose');

/**
 * 充值集合数据架构
 */

let chargeSchema = new mongoose.Schema({
    userName:{ type:String ,default:null},
    telNum:{ type:String },
    sum:{ type:Number, default:0},
    method:{ type:String ,default:'系统充值'},
    time:{ type:Date ,default:new Date()},
    orderNum:{ type:String, default:null },
    imgPath:{ type:String , default:''},
    state:{ type:String, default:'未通过' },
    operate:{ type:String,default:'已审核' }
});

module.exports = chargeSchema;