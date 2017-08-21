let userModel = require('../mongooseModule/model/userModel');

/**
 * 解锁账号模块
 */

function unFreezeUserPromise(telNum){
    return new Promise((resolve,reject) => {
        return (function(telNum){
            userModel.update({telNum:telNum},{isFreeze:false,state:'正常账号'},(err,docs) => {
                if(err){
                    reject(err)
                }
                else{
                    if(docs.n != 1){
                        resolve({err:"解锁账户失败，请检查该用户是否注册"});
                    }
                    else{
                        resolve({successful:'解锁成功'});
                    }
                }
            });
        })(telNum);
    });
}

module.exports = unFreezeUserPromise;