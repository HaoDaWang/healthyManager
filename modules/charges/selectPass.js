const chargeModel = require('../mongooseModule/model/chargeModel');
const imgMapModel = require('../mongooseModule/model/imgMapModel');
const adminCharge = require('../moneyStream/adminChargeMoney');

/**
 * 选中充值模块
 */

function selectPassPromise(telNumArr,isPass){
    return new Promise((resolve,reject) => {
        //封装为json数组
        let queryArray = [];
        let queryJSON = {};
        for(let val of telNumArr){
            queryJSON = {telNum:val}
            queryArray.push(queryJSON)
        }
        //查询
        chargeModel.find({$or:queryArray},(err,docs) => {
            if(err) reject(err);
            let imgPathArray = [];
            for(let val of docs){
                imgPathArray.push({imgPath:val.imgPath})
                 if(isPass){
                    //充值
                    adminCharge(val.telNum,val.sum)
                        .catch(err => {
                            reject(err)
                        })
                }
            }
            //删除图片映射
            imgMapModel.remove({$or:imgPathArray},(err,docs) => {
                if(err) reject(err);
                //删除申请
                chargeModel.remove({$or:queryArray},(err,docs) => {
                    if(err) reject(err);
                    resolve({successful:"操作成功"});
                })
            })
        })
    });
}

module.exports = selectPassPromise;