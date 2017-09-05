let userModel = require('../mongooseModule/model/userModel');
/**
 * 记录消费金额
 */

//sum为消费的金额美金
function consumeMoney(telNum, sum){
    return new Promise((resolve, reject) => {
        userModel.update({telNum:telNum},{$inc:{consumeMoney:sum}},(err,docs) => {
            if(err) reject(err);
            resolve({successful:"操作成功"});
        });
    });
}

module.exports = consumeMoney;