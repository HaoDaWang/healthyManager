const userModel = require('../mongooseModule/model/userModel');
const reduceHealthyMoney = require('../moneyStream/reduceHealthyMoney');
const serviceModel = require('../mongooseModule/model/serviceModel');
const prizeModel = require('../mongooseModule/model/prizeModel');
const updateExponent = require('./updateExponent');
const getThreeInvitTelNum = require('../userInfo/getThreeInvitTelNum');
const judgeTeam = require('../userInfo/judgeTeam');

/**
 * 购买123456星服务
 */

//service为购买几星服务的索引
function buyService(telNum,service){
    return new Promise((resolve, reject) => {
        (async function(){
            serviceModel.find({star:service},(err,docs) => {
                if(err) reject(err);
                if(docs.length == 0){
                    resolve({err:"字段有误"});
                    return;
                }
                //需要扣除的金额
                let price = docs[0].price;
                //相应需要扣除的现金
                let money = docs[0].money;
                reduceHealthyMoney(telNum, price,'ltjkj').then(data => {
                    if(data.err){
                        reject(data);
                        return;
                    }
                    console.log(data);
                    if(data.successful){
                        userModel.update({telNum:telNum},{$set:{level:service}},(err,docs) => {
                            if(err) reject(err);
                            if(docs.n == 1){
                                //更新指数
                                updateExponent(telNum, price)
                                    .then(data => {
                                        //写入消费金额
                                        userModel.update({telNum:telNum},{$inc:{consumeMoney:money}},(err,docs) => {
                                            if(err) reject(err);
                                            //查找三个上家
                                            
                                            getThreeInvitTelNum(telNum)
                                                .then(data => {
                                                    console.log(data);
                                                    let telNumArr = data.successful;
                                                    for(let i = 0;i < telNumArr.length;i++){
                                                        judgeTeam(telNumArr[i],money)
                                                            .then(data => {
                                                                if(data.err){
                                                                    console.log(data.err);
                                                                    resolve(data)
                                                                }
                                                                else{
                                                                    resolve(data)
                                                                }
                                                            });
                                                    }
                                                }).catch(err => {
                                                    console.log(err)
                                                })
                                        });
                                    });
                                // resolve({successful:"操作成功"})
                            }
                            else{
                                resolve({err:"操作失败，请检查手机号是否注册"});
                            }
                        });
                    }
                    else{
                        resolve(result);
                    }
                });
            });
        })();
    });
}

module.exports = buyService;