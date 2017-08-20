let userModel = require('../mongooseModule/model/userModel');
/**
 * 修改密码模块
 */

function editPasswPromise(telNum,newPassw){
    return new Promise((resolve,reject) => {
        return (function editPassw(telNum,newPassw){
            let query = {}
            userModel.update({telNum:telNum},{$set:{passw:newPassw}},{upsert:false},(err) => {
                if(err){
                    reject({err:err})
                }
                else{
                    resolve({successful:'修改成功'})
                }
            })
        })(telNum,newPassw);
    });
}

module.exports = editPasswPromise;