const userModel = require('../mongooseModule/model/userModel');
const judgeVIP = require('../moneyStream/judgeVIP');

/**
 * 拿到所有用户资料模块
 */

function getAllUsersPromise(){
    return new Promise((resolve,reject) => {
        return (function(){
            userModel.find({},(err,docs) => {
                if(err){
                    reject(err);
                }
                else{
                    for(let val of docs){
                        judgeVIP(val.telNum);
                    }
                    resolve(docs);
                }
            })
        })();
    });
}

module.exports = getAllUsersPromise;