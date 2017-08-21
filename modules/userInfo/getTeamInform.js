let userModel = require('../mongooseModule/model/userModel');

/**
 * 获取下线成员接口
 */

function getTeamInformPromise(telNum){
    return new Promise((resolve,reject) => {
        return (function(telNum){
            userModel.find({telNum:telNum},(err,docs) => {
                if(err) reject(err);
                if((!docs) || docs.length == 0){
                    resolve({err:"获取失败，请检查该账号是否注册"})
                }
                else{
                    resolve({successful:docs[0].teamInform});
                }
            });
        })(telNum);
    });
}

module.exports = getTeamInformPromise;