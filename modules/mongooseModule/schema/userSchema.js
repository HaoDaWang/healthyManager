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
    level:{ type:Number, default:0 },
    totalMoney:{ type:Number, default:0 },
    nowMoney:{
        jljcj:{ type:Number, default:0 },
        gwjcj:{ type:Number, default:0 },
        zzjcj:{ type:Number, default:0 },
        ltjcj:{ type:Number, default:0 }
    },
    teamInform:{ type:Array, default:[] }
});

module.exports = userSchema;
