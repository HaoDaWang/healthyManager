let userModel = require('../mongooseModule/model/userModel');
/**
 * 获取下级信息 包括人数和销量
 */

function userFindPromise(val){
    return new Promise((resolve,reject) => {
        userModel.find({telNum:val},(err,docs) => {
            resolve(docs[0]);
        });
    });
}

//封装查询Array
function wrapQueryArray(docs){
     //封装查询Array
    let queryArray = [];
    for(let val of docs[0].teamInform){
        queryArray.push({telNum:val});
    }
    return queryArray;
}

function getTeamInfo(telNum){
    return new Promise((resolve,reject) => {
        let count;
        let consume;
        userModel.find({telNum:telNum},(err,docs) => {
            if(err) reject(err);
            if(docs[0].teamInform.length == 0){
                resolve({count:0, consume:0,team:[]});
                return;
            }
            userModel.find({$or:wrapQueryArray(docs)},(err,docs) =>{
                if(err) reject(err);
                //人数
                count = docs.length;
                //销量
                consume = 0;
                for(let val of docs){
                    console.log('aaaaaaaaaaaaa: ' + val.consumeMoney);
                    consume += val.consumeMoney;
                }
                let one = {count:count, consume:consume, team:docs[0].teamInform};
                if(one.team.length == 0){
                    resolve({one:one,two:{count:0,consume:0},three:{count:0,consume:0}});
                    return;
                }
                //二级
                userModel.find({$or:wrapQueryArray(docs)},(err, docs) => {
                    if(err) reject(err);
                    //人数
                    count = docs.length;
                    //销量
                    consume = 0;
                    for(let val of docs){
                        console.log('aaaaaaaaaaaaa: ' + val.consumeMoney);
                        consume += val.consumeMoney;
                    }
                    let two = {count:count, consume:consume, team:docs[0].teamInform};
                    if(two.team.length == 0){
                        resolve({one:one,two:two,three:{count:0,consume:0}});
                        return;
                    }
                    //三级
                    userModel.find({$or:wrapQueryArray(docs)},(err, docs) => {
                        if(err) reject(err);
                        //人数
                        count = docs.length;
                        //销量
                        consume = 0;
                        for(let val of docs){
                            console.log('aaaaaaaaaaaaa: ' + val.consumeMoney);
                            consume += val.consumeMoney;
                        }
                        let three = {count:count, consume:consume, team:docs[0].teamInform};
                        resolve({one:one,two:two,three:three});
                    });
                });
            });
        });
    });
}

module.exports = getTeamInfo;