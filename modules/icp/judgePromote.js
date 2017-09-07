const userModel = require('../mongooseModule/model/userModel');
/**
 * 判断推荐奖
 */

//修改用户等级
function updateLevel(telNum){
    return new Promise((resolve, reject) => {
        userModel.update({telNum:telNum},{$inc:{level:1}},(err,docs) => {
            if(err) reject(err);
            if(docs.n == 1){
                resolve({successful:"successful"});
            }
            else{
                resolve({err:'err'})
            }
        });
    });
}

function judgePromote(){
    return new Promise((resolve,reject) => {
        userModel.find({},(err,docs) => {
            if(err) reject(err)
            let queryArr = [];
            //当前用户的等级
            let currenLevel = 0;
            //当前用户的消费金额
            let currentConsume = 0;
            //当前用户的手机号
            let currentTelNum = '';
            //记录迭代个数
            let index = 0;
            let count = docs.length;
            for(let val of docs){
                index++;
                currentTelNum = val.telNum;
                currentConsume = val.consumeMoney;
                currenLevel = val.level;
                //判断是否有下线用户
                if(val.teamInform.length == 0){
                    if(index == count){
                        resolve({successful:"successful"});
                    }
                    continue;
                }
                //查询该用户的下级
                for(let telNum of val.teamInform){
                    queryArr.push({telNum:telNum});
                }
                console.log(queryArr);
                userModel.find({$or:queryArr},(err,docs) => {
                    if(err) reject(err);
                    //下线用户的消费总量
                    let levelArr = [];
                    let consumeCount = 0;
                    for(let val of docs){
                        consumeCount += val.consumeMoney;
                        if(val.level > currenLevel){
                            levelArr.push(val.telNum);
                        }
                    }
                    if(consumeCount >= (currentConsume*20)){
                        updateLevel(currentTelNum);
                    }
                    else if(levelArr >= 5){
                        updateLevel(currentTelNum);
                    }
                    console.log("1");
                });
            }
            console.log("2");
        });       
    });
}

function getPromoteData(){
    return new Promise((resolve,reject) => {
        userModel.find({},(err,docs) => {
            if(err) reject(err);
            let resultArr = [];
            for(let val of docs){
                resultArr.push({userName:val.userNamem,telNum:val.telNum,lowerLevelMoney:val.lowerLevelMoney,promote:val.promote});
            }
            resolve({successful:resultArr});
        });
    });
}

module.exports = {
    getPromoteData:getPromoteData,
    judgePromote:judgePromote
};