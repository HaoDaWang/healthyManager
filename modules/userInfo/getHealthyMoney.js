const userModel = require('../mongooseModule/model/userModel');

/**
 * 获取指定用户的健康金详情
 */

function getHealthyMoneyPromise(telNum){
    return new Promise((resolve,reject) => {
        return (function(telNum){
            userModel.find({telNum:telNum},(err,docs) => {
                if(err) reject(err);
                resolve({successful:docs[0].healthyMoney})
            })
        })(telNum);
    });
}

module.exports = getHealthyMoneyPromise;