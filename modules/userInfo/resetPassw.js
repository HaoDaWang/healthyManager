const userModel = require('../mongooseModule/model/userModel');

/**
 * 重置密码模块
 */

function resetPasswPromise(telNum){
    return new Promise((resolve,reject) => {
        return (function(telNum){
            userModel.update({telNum:telNum},{passw:'123456'},(err,docs) => {
                if(err){
                    reject(err)
                }
                else{
                    if(docs.n != 1){
                        resolve({err:'重置失败，请检查手机号是否注册'})
                    }
                    else{
                        resolve({successful:"充值成功，初始密码为123456"});
                    }
                }
            })
        })(telNum);
    });
}

module.exports = resetPasswPromise;