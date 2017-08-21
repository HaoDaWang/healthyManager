const userModel = require('../mongooseModule/model/userModel');
const judgeTypeObj = require('./judgeType');
/**
 * 充值模块
 */

function chargeMoneyPromise(telNum,sum,type){
    return new Promise((resolve,reject) => {
        return (function chargeMoney(telNum,sum,type){
            //查找文档
            userModel.find({telNum:telNum},(err,docs) => {
                if((!docs) || docs.length == 0){
                    resolve({err:'找不到该手机号，或该手机号还未注册'});
                }
                else{
                    let nowMoneyObj = docs[0].nowMoney;
                    //判断类型
                    let updateJSON = judgeTypeObj.judgeType(judgeTypeObj.chargeMoney,type,sum,nowMoneyObj);
                    userModel.update({telNum:telNum},{$set:updateJSON},(err,docs) => {
                        if(err) reject({err:err})
                        resolve({successful:'充值成功'})
                    })
                }
            });
        })(telNum,sum,type);
    });
}

module.exports = chargeMoneyPromise;