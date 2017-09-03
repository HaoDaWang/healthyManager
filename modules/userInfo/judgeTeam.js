const userModel = require('../mongooseModule/model/userModel');

/**
 * 根据分配算法,遍历用户下家，判断是否有收入增长
 */

//解构赋值各个等级分配的百分比
const [LEVEL1, LEVEL2, LEVEL3, LEVEL4, LEVEL5, LEVEL6] = [0.06, 0.07, 0.08, 0.09, 0.1, 0.11];

function judgeTeam(telNum){
    return new Promise((resolve, reject) => {
        //查询用户等级，确定分配比例
        userModel.find({telNum:telNum},(err, docs) => {
            if(err) reject(err);
            if((!docs) || docs.length == 0){
                //查询失败
                resolve({err:'操作失败，请判断用户手机号是否存在'});
            }
            else {
                //查询成功
                resolve({successful:'操作成功'});
                //遍历该用户的前三个下级
                let teamInfo = docs[0].teamInform;
                //判断是否有下家
                if(teamInfo.length == 0){
                    resolve({err:'很抱歉，该用户没有下级'});
                }
                else {
                    //当前用户的健康金等级
                    let level = docs[0].level;
                    //下级用户的消费总金额
                    let totalMoney = 0;
                    //奖励过后的金额
                    let resultMoney = 0;
                    //封装为查询JSON
                    let queryArray = [];
                    for(let i = 0;i < 3;i++){
                        queryArray.push({telNum:teamInfo[i]});
                    }
                    //查询下级用户
                    userModel.find({$or:queryArray},(err,docs) => {
                        if(err) reject(err);
                        for(let obj of docs){
                            totalMoney += docs.totalMoney;
                        }
                        switch(level){
                            case 1:
                                resultMoney = totalMoney * LEVEL1;
                            break;
                            case 2:
                                resultMoney = totalMoney * LEVEL2;
                            break;
                            case 3:
                                resultMoney = totalMoney * LEVEL3;
                            break;
                            case 4:
                                resultMoney = totalMoney * LEVEL4;
                            break;
                            case 5:
                                resultMoney = totalMoney * LEVEL5;
                            break;
                            case 6:
                                resultMoney = totalMoney * LEVEL6;
                            break;
                        }
                    });
                    //写入当前用户下级收入
                    userModel.update({telNum:telNum},{$set:{lowerLevelMoney:resultMoney}},(err,docs) => {
                        if(err) reject(err);
                        if(docs.n == 1){
                            resolve({successful:"操作成功"});
                        }
                        else {
                            resolve({err:'出现未知错误，操作失败'});
                        }
                    });
                }
            }
        });
    });
}
