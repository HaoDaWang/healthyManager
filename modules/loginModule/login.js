let userModel = require('../mongooseModule/model/userModel');
/**
 * 登录模块
 */

let loginPromise = (telNum,passw) => {
    return new Promise((resolve,reject) => {
        return (function login(telNum,passw){
            userModel.find({telNum:telNum, passw:passw},(err,docs) => {
                if(err) reject({ err:JSON.stringify(err) });
                if((!docs) || docs.length == 0){
                    resolve({err:'账号密码不符'})
                }
                else {
                    //符合
                    if(docs[0].isFreeze){
                        resolve({err:'该账号已被冻结'})
                    }
                    else {
                        resolve({successful:"登录成功"});  
                    }
                }
            });
        })(telNum,passw);
    })
}



module.exports = loginPromise;