const userModel = require('../mongooseModule/model/userModel');

/**
 * 查询当前用户的三个上家
 * @return Array
 */

let invitTelNumLevel1, invitTelNumLevel2, invitTelNumLevel3;

function getThreeInvitTelNum (telNum){
    return new Promise((resolve, reject) => {
        userModel.find({telNum:telNum},(err,docs) => {
            if(err) reject(err);
            //一级上家
            if(docs[0].invitTelNum || docs[0].invitTelNum != ''){
                invitTelNumLevel1 = docs[0].invitTelNum;
                userModel.find({telNum:invitTelNumLevel1},(err,docs) => {
                    if(err) reject(err);
                    //二级上家
                    if(docs[0].invitTelNum || docs[0].invitTelNum != ''){
                        invitTelNumLevel2 = docs[0].invitTelNum;
                        userModel.find({telNum:invitTelNumLevel2},(err,docs) => {
                            if(err) reject(err);
                            //三级上家
                            if(docs[0].invitTelNum || docs[0].invitTelNum != ''){
                                invitTelNumLevel3 = docs[0].invitTelNum;
                                //返回一个数组
                                console.log("aaaaaaaaaaaaaaaaaaaaa")
                                resolve({successful:[invitTelNumLevel1,invitTelNumLevel2,invitTelNumLevel3]});
                            }
                            else {
                                resolve({successful:[invitTelNumLevel1,invitTelNumLevel2]});
                            }
                        });
                    }
                    else {
                        resolve({successful:[invitTelNumLevel1]})
                    }
                });   
            }
            else {
                resolve({successful:[]});
            }
        });
    });
}

module.exports = getThreeInvitTelNum;