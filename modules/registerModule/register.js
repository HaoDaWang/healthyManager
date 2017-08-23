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
                invitTelNum:invitTelNum,
                registeTime:new Date()
            });
            //查询是否被注册
            userModel.find({telNum:telNum},(err,docs) =>　{
                if(err){
                    reject({err:JSON.stringify(err)})
                }
                else{
                    if(docs.length > 0){
                        //账号已经存在
                        resolve({err:'账号已经存在'});
                    }
                    else {
                        //判断上级用户是否存在
                        userModel.find({telNum:invitTelNum},(err,docs) => {
                            if(err){
                                reject(err)
                            }
                            if((!docs) || docs.length == 0){
                                console.log("docs       111111    :            " + docs);
                                resolve({err:'推荐人电话不存在'});
                            }
                            else {
                                let teamInform = docs[0].teamInform;
                                teamInform.push(telNum)
                                userModel.update({telNum:invitTelNum},{$set:{teamInform:teamInform}},(err,docs) => {
                                    if(err) reject(err);
                                    //保存数据
                                    userEntity.save((err,doc) => {
                                        if(err) reject({err:JSON.stringify(err)});
                                        resolve({successful:doc})
                                    });
                                    
                                })
                            }
                        });
                    }
                }
            })
        })(userName, passw, telNum, invitTelNum)
    });
}


module.exports = registerPromise;