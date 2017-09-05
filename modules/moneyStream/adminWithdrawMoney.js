const userModel = require('../mongooseModule/model/userModel');
/**
 * 管理员扣款模块
 */

function adminWithdrawMoneyPromise(telNum,sum,type){
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
                        //检查是否有足够余额扣款
                        userModel.find({telNum:telNum},(err,docs) => {
                            if(err) reject(err);
                            if(docs[0].nowMoney < 0){
                                userModel.update({telNum:telNum},{$inc:{nowMoney: parseFloat(sum).toFixed(2)}},(err,docs) => {
                                    if(err) reject(err);
                                    resolve({err:"扣款失败，请检查账户余额"})
                                })
                            }
                            //写入用户提现记录
                            else{
                                //判断扣款类型
                                if(type == ''){
                                    
                                }
                                else{
                                    userModel.update({telNum:telNum},{$push:{withdrawLog:{time:new Date(),sum:sum}}},(err,docs) => {
                                        if(err) reject(err);
                                        resolve({successful:"扣款成功"})
                                    })
                                }
                            }
                        })
                    }
                }
            })
        })(telNum,sum);
    });
}

module.exports = adminWithdrawMoneyPromise;