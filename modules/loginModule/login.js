let userModel = require('../mongooseModule/model/userModel');
/**
 * 登录模块
 */

let loginPromise = (telNum,passw) => {
    return new Promise((resolve,reject) => {
        return (function login(telNum,passw){
            userModel.find({telNum:telNum, passw:passw},(err,docs) => {
                if(err) reject({ err:JSON.stringify(err) });
                resolve({ successful:docs });
            });
        })(telNum,passw);
    })
}



module.exports = loginPromise;