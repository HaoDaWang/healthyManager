const userModel = require('../mongooseModule/model/userModel');
/**
 * 管理员扣款模块
 */

function adminWithdrawMoneyPromise(telNum,sum){
    return new Promise((resolve,reject) => {
        return (function adminWithdrawMoney(telNum,sum){
            userModel.update({telNum:telNum},{$inc:{nowMoney:(0 - parseFloat(sum)).toFixed(2)}},(err,docs) => {
                if(err){
                    reject(err)
                }
                else {
                    if(docs.n != 1){
                        resolve({err:'扣款发生错误，请检查用户是否存在'});
                    }
                    else{
                        resolve({successful:"扣款成功"})
                    }
                }
            })
        })(telNum,sum);
    });
}

module.exports = adminWithdrawMoneyPromise;