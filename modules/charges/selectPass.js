const chargeModel = require('../mongooseModule/model/chargeModel');
const imgMapModel = require('../mongooseModule/model/imgMapModel');
const adminCharge = require('../moneyStream/adminChargeMoney');
const adminWithdraw = require('../moneyStream/adminWithdrawMoney');

/**
 * 选中指定模块 （驳回/通过）
 */

function selectPassPromise(targetModel,telNumArr,isPass,target,poundage){
    return new Promise((resolve,reject) => {
        //封装为json数组
        let queryArray = [];
        let queryJSON = {};
        console.log(telNumArr)
        for(let val of telNumArr){
            queryJSON = {telNum:val}
            queryArray.push(queryJSON)
        }
        //查询
        targetModel.find({$or:queryArray},(err,docs) => {
            if(err) reject(err);
            let imgPathArray = [];
            for(let val of docs){
                if(isPass){
                    //判断目标模块的类型
                    if(target == 'chargeModel'){
                        //Push进查询字符串
                        imgPathArray.push({imgPath:val.imgPath})
                        //充值
                        adminCharge(val.telNum,val.sum)
                            .catch(err => {
                                reject(err)
                            })
                    }
                    else if(target == 'withdrawModel'){
                        if(val.method == '支付宝' || val.method == '微信'){
                            
                            imgPathArray.push({withdrawCode:val.withdrawCode})
                        }
                        adminWithdraw(val.telNum,parseFloat(val.sum) + parseFloat(poundage))
                    }
                }
            }
            if(target == 'withdrawModel'){
                //删除申请
                targetModel.remove({$or:queryArray},(err,docs) => {
                    if(err) reject(err);
                    resolve({successful:"操作成功"});
                })
            }
            else {
                //删除图片映射
                targetModel.remove({$or:imgPathArray},(err,docs) => {
                    if(err) reject(err);
                    //删除申请
                    targetModel.remove({$or:queryArray},(err,docs) => {
                        if(err) reject(err);
                        resolve({successful:"操作成功"});
                    })
                })
            }
        })
    });
}

module.exports = selectPassPromise;