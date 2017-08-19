/**
 * 用户集合数据架构
 */
const mongoose = require('mongoose');

//创建集合数据架构
let userSchema = new mongoose.Schema({
    userName:{ type:String },
    telNum:{ type:String },
    passw:{ type:String },
    invitTelNum:{ type:String },
    level:{ type:Number },
    totalMoney:{ type:Number },
    nowMoney:{
        jljcj:{ type:number, default:0 },
        gwjcj:{ type:number, default:0 },
        zzjcj:{ type:number, default:0 },
        ltjcj:{ type:number, default:0 }
    },
    dealTime:{ type:Date },
    teamInform:{ type:Array }
});

module.exports = userSchema;
