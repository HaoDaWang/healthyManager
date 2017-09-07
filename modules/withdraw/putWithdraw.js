const withdrawModel = require('../mongooseModule/model/withdrawModel');
const userMolde = require('../mongooseModule/model/userModel');

/**
 * 提交提现申请模块
 * @description 必须提交的字段：telNum, sum, method, withdrawCode
 */

function putWithdraw(telNum, sum, method, withdrawCode){
    return new Promise((resolve, reject) => {
        //如果为支付宝和微信，提现码为支付宝和微信的转账图片
        if(method == '支付宝' || method =='微信'){
            withdrawModel.update({telNum:telNum},{$set:{sum:sum}},(err,docs) => {
                if(err) reject(err);
                if(docs.n != 1){
                    resolve({err:"提交提现申请失败，请检查用户是否注册"})
                }
                else {
                    resolve({successful:"提交提现申请成功"})
                }
            })
        }
        //如果为银行卡， 则为开户人信息
        else{
            //查询是否有身份证号
            userMolde.find({telNum:telNum},(err,docs) => {
                if(err) reject(err);
                let doc = docs[0];
                //存在银行卡开户信息
                if(doc.openingBank && doc.BankCardNum){
                    withdrawModel.update({telNum:telNum},{$set:{sum:sum, withdrawCode:{openingBank:doc.openingBank,BankCardNum:doc.BankCardNum}}},(err,docs) => {
                        if(docs.n != 1){
                            resolve({err:"提交提现申请失败，请检查用户是否注册"})
                        }
                        else {
                            resolve({successful:"提交提现申请成功"})
                        }
                    })
                }
                //不存在
                else{
                    resolve({err:"请填写个人信息里的开户姓名和银行卡账号再次尝试"});
                }
            });
        }
    })
}

module.exports = putWithdraw;