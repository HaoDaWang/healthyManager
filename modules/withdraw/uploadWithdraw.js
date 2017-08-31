const withdrawModel = require('../mongooseModule/model/withdrawModel');
const userModel = require('../mongooseModule/model/userModel');

/**
 * 支付宝微信提现图片上传模块
 */


function uploadWithdraw(imgPath, telNum, method){//method 为支付宝或者微信
    console.log('aaaaaaaaaaaaaaaaaaaaaaa')
    return new Promise((resolve, reject) => {
        //查看用户是否有正在处理的订单
        withdrawModel.find({telNum:telNum},(err,docs) => {
            if(err) reject(err);
            if((!docs) || docs.length == 0){
                //查找用户名
                userModel.find({telNum:telNum},(err,docs) => {
                    if(err) reject(err);
                    let withdrawEntity = new withdrawModel({
                        telNum: telNum,
                        withdrawCode: imgPath,
                        method:method,
                        userName:docs[0].userName
                    });
                    //写入提现集合
                    withdrawEntity.save((err,docs) => {
                        if(err) reject(err);
                        resolve({successful:"上传提现图片成功"})
                    })
                })
            }
            else{
                resolve({err:'对不起，你已有订单正在处理中'})
            }
        })
    })
}

module.exports = uploadWithdraw;