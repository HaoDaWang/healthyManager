let chargeModel = require('../mongooseModule/model/chargeModel');
let userModel = require('../mongooseModule/model/userModel');
let getOrderNum = require('./getOrderNum');
let imgMapModel = require('../mongooseModule/model/imgMapModel')

/**
 * 提交充值申请模块
 */

function putChargePromise(telNum,sum,imgPath){
    return new Promise((resolve,reject) => {
        return (function(telNum,sum,imgPath){
            //查询用户名称
            userModel.find({telNum:telNum},(err,docs) => {
                if(err) reject(err);
                let userName = docs[0].userName;
                //保存用户申请信息
                chargeModel.update({telNum:telNum,imgPath:imgPath},{$set:{userName:userName,orderNum:getOrderNum(),sum:sum}},(err,docs) => {
                    if(err) reject(err);
                    if(docs.n != 1){
                        resolve({err:'提交失败，请检查手机号是否注册'});
                    }
                    else{
                        resolve({successful:'提交申请成功！'});
                    }
                }); 
            });
        })(telNum,sum,imgPath);
    });
}

module.exports = putChargePromise;