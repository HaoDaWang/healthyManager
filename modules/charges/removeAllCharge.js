let chargeModel = require('../mongooseModule/model/chargeModel');
let imgMapModel = require('../mongooseModule/model/imgMapModel');
const adminCharge = require('../moneyStream/adminChargeMoney');
/**
 * 此模块的功能主要为删除充值的集合以及充值图片的映射表
 */

function removeAllChargePromise(isPass){
    return new Promise((resolve,reject) => {
        return (function(){
            //充值
            chargeModel.find({},(err,docs) => {
                if(err) reject(err);
                for(let val of docs){
                    if(isPass){
                        adminCharge(val.telNum,val.sum)
                    }
                }
                chargeModel.remove({},err => {
                    if(err) reject(err);
                    imgMapModel.remove({},err => {
                        if(err) reject(err);
                        resolve({successful:'操作成功'});
                    })
                });
            })
        })();
    });
}

module.exports = removeAllChargePromise;