const userModel = require('../mongooseModule/model/userModel');
/**
 * 提交用户个人资料
 */

function putUserInfo(telNum, userName, sex, IDNum, BankCardNum, openingBank){
    return new Promise((resolve, reject) => {
        userModel.update({telNum:telNum},{$set:{userName:userName, sex:sex, IDNum:IDNum, BankCardNum:BankCardNum, openingBank:openingBank}},(err,docs) => {
            if(err) reject(err);
            if(docs.n == 1){
                resolve({successful:'操作成功'});
            }
            else {
                resolve({err:"操作失败"});
            }
        });
    });
}

module.exports = putUserInfo;