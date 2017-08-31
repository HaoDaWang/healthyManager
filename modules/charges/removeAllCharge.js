let chargeModel = require('../mongooseModule/model/chargeModel');
let imgMapModel = require('../mongooseModule/model/imgMapModel');
const adminCharge = require('../moneyStream/adminChargeMoney');
const adminWithdraw = require('../moneyStream/adminWithdrawMoney');
/**
 * 此模块的功能主要为删除指定的集合以及充值图片的映射表
 */


//target为标识目前传进来的Model是什么
function removeAllChargePromise(targetModel, isPass, target){
    console.log('comin');
    return new Promise((resolve,reject) => {
        return (function(){
            //充值
            targetModel.find({},(err,docs) => {
                if(err) reject(err);
                for(let val of docs){
                    if(isPass){
                        if(target == 'withdrawModel'){
                            //提现
                            adminWithdraw(val.telNum, val.sum);
                        }
                        else if(target == 'chargeModel'){
                            //充值
                            adminCharge(val.telNum,val.sum)
                        }
                    }
                }
                
                //删除指定模块的所有数据
                targetModel.remove({},err => {
                    if(err) reject(err);
                    //删除图片路径映射
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