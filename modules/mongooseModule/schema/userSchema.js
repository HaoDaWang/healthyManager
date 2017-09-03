/**
 * 用户集合数据架构
 */
const mongoose = require('mongoose');

//创建用户集合数据架构
let userSchema = new mongoose.Schema({
    userName:{ type:String },
    telNum:{ type:String },
    passw:{ type:String },
    invitTelNum:{ type:String },
    level:{ type:Number, default:0 },
    totalMoney:{ type:Number, default:0 },
    nowMoney:{type:Number, default:0},
    healthyMoney:{
        jljkj:{ type:Number, default:0 },
        gwjkj:{ type:Number, default:0 },
        zzjkj:{ type:Number, default:0 },
        ltjkj:{ type:Number, default:0 }
    },
    teamInform:{ type:Array, default:[] },
    registeTime:{type:Date, default:new Date()},
    isFreeze:{type:Boolean, default:false},
    state:{type:String ,default:'正常账号'},
    VIP:{type:String, default:'无'},
    zzb:{type:Number, default:0},
    chargeLog:{type:Array,default:[]},
    withdrawLog:{type:Array,default:[]},
    lowerLevelMoney:{type:Number,default:0}
});

module.exports = userSchema;