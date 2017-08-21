const userModel = require('../mongooseModule/model/userModel');
/**
 * 管理员操作充值模块
 */

function adminChargeMoneyPromise(telNum,sum){
    return new Promise((resolve,reject) => {
        return (function adminChargeMoney(telNum,sum){
            userModel.update({telNum:telNum},{$inc:{nowMoney:parseFloat(sum).toFixed(2)}},(err,docs) => {
                if(err){
                    reject(err)
                }
                else{
                    if(docs.n != 1){
                        resolve({err:'充值发生错误，请检查用户是否存在'})
                    }
                    else {
                        resolve({successful:"充值成功"})
                    }
                }
            })
        })(telNum,sum);
    });
}

module.exports = adminChargeMoneyPromise;