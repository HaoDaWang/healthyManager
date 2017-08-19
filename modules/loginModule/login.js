let userSchema = require('../mongooseModule/schema/userSchema');
/**
 * 登录模块
 */

function login(telNum,passw){
    userSchema.find({telNum:telNum, passw:passw},(err,docs) => {
        if(err) return { err:JSON.stringify(err) }
        return { successful:docs }
    });
} 