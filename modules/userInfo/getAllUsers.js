const userModel = require('../mongooseModule/model/userModel');

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
                    resolve(docs);
                }
            })
        })();
    });
}

module.exports = getAllUsersPromise;