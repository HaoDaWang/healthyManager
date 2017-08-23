let chargeModel = require('../mongooseModule/model/chargeModel');
let imgMapModel = require('../mongooseModule/model/imgMapModel')

/**
 * 提交充值图片模块
 */

function uploadChargePromise(imgPath,telNum){
    return new Promise((resolve,reject) => {
        return (function(imgPath,telNum){
            //检查是否提交过了
            chargeModel.find({telNum:telNum},(err,docs) => {
                if(err) reject(err);
                if((!docs) || docs.length == 0){
                    //检查是否为表单重复提交
                    imgMapModel.find({imgPath:imgPath},(err,docs) => {
                        if(err) reject(err);
                        if((!docs) || docs.length == 0){
                            //success
                            //储存图片路径到图片映射
                            let imgMapEntity = new imgMapModel({
                                imgPath:imgPath
                            });
                            imgMapEntity.save((err,docs) => {
                                if(err) reject(err);
                                //创建模型实例
                                let chargeEntity = new chargeModel({
                                    telNum:telNum,
                                    imgPath:imgPath
                                });
                                chargeEntity.save((err,doc) => {
                                    if(err) reject(err);
                                    resolve({successful:"上传图片成功"});
                                });
                            });
                        }
                        else{
                            resolve({err:'请勿重复提交图片！'})
                        }
                    })    
                }
                else{
                    resolve({err:'很抱歉，你已有订单正在处理中'})
                }
            })
        })(imgPath,telNum);
    });
}

module.exports = uploadChargePromise;