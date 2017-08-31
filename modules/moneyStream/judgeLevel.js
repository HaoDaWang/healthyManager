const userModel = require('../mongooseModule/model/userModel');

/**
 * 用户等级判断
 */

function judgeHealthyMoneyPromise(telNum){
    return new Promise((resolve,reject) => {
        userModel.find({telNum},(err,docs) => {
            if(err) reject(err);
            let totalMoney = docs[0].totalMoney;
            let level = 0;
            //六级用户
            if(totalMoney >= 114545.46){
                level = 6
            }
            //五级用户
            else if(totalMoney >= 56363.64){
                level = 5
            }
            //四级用户
            else if(totalMoney >= 27272.73){
                level = 4
            }
            //三级用户
            else if(totalMoney >= 12727.27){
                level = 3
            }
            //二级用户
            else if(totalMoney >= 5454.55){
                level = 2
            }
            //一级用户
            else if(totalMoney >= 1818.18){
                level = 1
            }
            //检查是否还未到达用户级别
            if(level != 0){
                userModel.update({telNum:telNum},{$set:{level:level}},(err,docs) => {
                    //判断是否更新成功
                    if(docs.n != 1){
                        resolve({err:'请检查用户是否注册'});
                    }
                    else{
                        resolve({successful:'更新用户等级成功'})
                    }
                })
            }
            else {
                resolve({successful:'更新用户等级成功'})
            }
        })
    })
}

module.exports = judgeHealthyMoneyPromise;