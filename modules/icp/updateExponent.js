const prizeModel = require('../mongooseModule/model/prizeModel');
const userModel = require('../mongooseModule/model/userModel');

function updateExponent(telNum, consumeMoney){
    return new Promise((resolve,reject) => {
        //纳入分红用户
        userModel.find({telNum:telNum},(err,docs) => {
            if(err) reject(err);
            if(docs[0].isExit){
                userModel.update({telNum:telNum},{$set:{isExit:true}},(err,docs) => {if(err) reject(err)});
                prizeModel.update({},{$push:{users:telNum}},(err,docs) => {
                    if(err) reject(err);
                    if(docs.n == 1){
                        //查询当前大盘信息
                        prizeModel.find({},(err,docs) => {
                            if(err) reject(err);
                            let doc = docs[0];
                            exponent = (((consumeMoney/doc.expectMoney) * (doc.expectExponent - doc.exponent)) + doc.ectualExponent).toFixed(20);
                            console.log(exponent,doc.expectMoney,doc.expectExponent,doc.exponent,doc.ectualExponent);
                            let index = doc.index;
                            let totalMoney = doc.totalMoney + consumeMoney;
                            //判断是否可以晋级下一轮
                            if(totalMoney >= consumeMoney || exponent >= doc.expectExponent){
                                //清零总金额 重置指数
                                prizeModel.update({},{$set:{totalMoney:0,exponent:0.055}},(err,docs) => {
                                    if(err) reject(err);
                                    resolve({successful:'操作成功，开始下一轮分红'});
                                });
                                //分红实现逻辑 TODO

                            }
                            else {
                                //写入当前消费金额和指数
                                prizeModel.update({},{$set:{totalMoney:totalMoney,exponent:exponent}},(err,docs) => {
                                    if(err) reject(err)
                                    resolve({successful:"操作成功"});
                                });
                            }
                        });
                    }
                    else{
                        resolve({err:'纳入分红用户失败'});
                    }
                });
            }
        });
    });
}

module.exports = updateExponent;