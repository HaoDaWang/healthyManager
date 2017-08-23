let userModel = require('../mongooseModule/model/userModel');
/**
 * 修改密码模块
 */

function editPasswPromise(telNum,newPassw){
    return new Promise((resolve,reject) => {
        return (function editPassw(telNum,newPassw){
            let query = {}
            userModel.update({telNum:telNum},{$set:{passw:newPassw}},{upsert:false},(err,docs) => {
                if(err){
                    reject({err:err})
                }
                else{
                    if(docs.n != 1){
                        resolve({err:"修改密码失败，请检查该用户是否存在"})
                    }
                    resolve({successful:'修改成功'})
                }
            })
        })(telNum,newPassw);
    });
}

module.exports = editPasswPromise;