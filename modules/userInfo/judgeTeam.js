const userModel = require('../mongooseModule/model/userModel');

/**
 * 根据分配算法,遍历用户下家，判断是否有收入增长
 */

//解构赋值各个等级分配的百分比
const [LEVEL1, LEVEL2, LEVEL3, LEVEL4, LEVEL5, LEVEL6] = [0.06, 0.07, 0.08, 0.09, 0.1, 0.11];

//sum 为消费的现金 changeTelNum 为消费的用户
function judgeTeam(telNum, sum){
    return new Promise((resolve, reject) => {
        console.log("aaaaaaaaaaaaaaaaaa");
        //查询等级
        userModel.find({telNum:telNum},(err,docs) => {
            if(err) reject(err);
            if(docs || docs.length != 0){
                let level = docs[0].level;
                let resultMoney = 0;
                switch(level){
                    case 1:
                        resultMoney = sum * LEVEL1;
                        break;
                    case 2:
                        resultMoney = sum * LEVEL2;
                    break;
                    case 3:
                        resultMoney = sum * LEVEL3;
                    break;
                    case 4:
                        resultMoney = sum * LEVEL4;
                    break;
                        case 5:
                        resultMoney = sum * LEVEL5;
                    break;
                    case 6:
                        resultMoney = sum * LEVEL6;
                    break;
                }
                //写入用户现金
                userModel.update({telNum:telNum},{$inc:{nowMoney:resultMoney,lowerLevelMoney:resultMoney}},(err,docs) => {
                    if(err) reject(err);
                    if(docs.n == 1){
                        resolve({successful:'操作成功'});
                    }
                    else {
                        resolve({err:'操作失败'});
                    }
                });
            }
            else {
                resolve({err:"操作失败，请检查手机号是否注册"});
            }
        });
    });
}

module.exports = judgeTeam;