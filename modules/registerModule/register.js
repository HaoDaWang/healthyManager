let userModel = require('../mongooseModule/model/userModel');

//注册模块
//封装为promise
let registerPromise = (userName, passw, telNum, invitTelNum) => {
    return new Promise((resolve,reject) => {
        return (function register(userName, passw, telNum, invitTelNum,validCode){
            //创建模型实例
            let userEntity = new userModel({
                userName:userName,
                passw:passw,
                telNum:telNum,
                invitTelNum:invitTelNum
            });

            //保存数据
            userEntity.save((err,doc) => {
                if(err) reject({err:JSON.stringify(err)});
                resolve({successful:doc})
            });
        })(userName, passw, telNum, invitTelNum)
    });
}


module.exports = registerPromise;