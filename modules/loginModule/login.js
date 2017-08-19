let userSchema = require('../mongooseModule/schema/userSchema');
/**
 * 登录模块
 */

let loginPromise = (telNum,passw) => {
    return new Promise((resolve,reject) => {
        return (function login(telNum,passw){
            userSchema.find({telNum:telNum, passw:passw},(err,docs) => {
                if(err) reject({ err:JSON.stringify(err) });
                return resove({ successful:docs })
            });
        })(telNum,passw);
    })
}



module.exports = loginPromise;