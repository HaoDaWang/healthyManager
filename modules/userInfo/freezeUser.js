let userModel = require('../mongooseModule/model/userModel');

/**
 * 冻结账号模块
 */

function freezeUserPromise(telNum){
    return new Promise((resolve,reject) => {
        return (function(telNum){
            userModel.update({telNum:telNum},{isFreeze:true,state:'锁定账号'},(err,docs) => {
                if(err){
                    reject(err)
                }
                else{
                    if(docs.n != 1){
                        resolve({err:"锁定账户失败，请检查该用户是否注册"});
                    }
                    else{
                        resolve({successful:'锁定成功'});
                    }
                }
            });
        })(telNum);
    });
}

module.exports = freezeUserPromise;