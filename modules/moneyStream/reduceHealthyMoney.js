const userModel = require("../mongooseModule/model/userModel");
/**
 * 扣除健康金模块
 */

function reduceHealthyMoney(telNum, sum, type){
    return new Promise((resolve,reject) => {
        let resultJSON = '';
        switch(type){
            case 'ltjkj':
                resultJSON = {"healthyMoney.ltjkj":parseFloat((0-sum)).toFixed(2)};
                break;
            case 'gwjkj':
                resultJSON = {'healthyMoney.gwjkj':(0-sum).toFixed(2)};
                break;
            case 'zzjkj':
                resultJSON = {'healthyMoney.zzjkj':(0-sum).toFixed(2)};
                break;
            case 'jljkj':
                resultJSON = {'healthyMoney.jljkj':(0-sum).toFixed(2)};
                break;
        }
        console.log("sum : " + JSON.stringify(resultJSON));
        userModel.update({telNum:telNum},{$inc:resultJSON},(err,docs) => {
            if(err) console.log(err);
            userModel.find({telNum:telNum},(err,docs) => {
                if(err) reject(err);
                let resultMoney = 0;
                if(type == 'ltjkj'){
                    console.log("ccccccccccccccccccc" + docs[0].healthyMoney.ltjkj)
                    resultMoney = docs[0].healthyMoney.ltjkj;
                }
                else if(type == 'gwjkj'){
                    resultMoney = docs[0].healthyMoney.gwjkj;
                }
                else if(type == 'jljkj'){
                    resultMoney = docs[0].healthyMoney.jljkj;
                }
                else if(type == 'zzjkj'){
                    resultMoney = docs[0].healthyMoney.zzjkj;
                }
                console.log(resultMoney);
                if(resultMoney >= 0){
                    resolve({successful:"扣款成功"});
                }
                else{
                     //没有足够余额
                    switch(type){
                        case 'ltjkj':
                            resultJSON = {"healthyMoney.ltjkj":sum};
                            break;
                        case 'gwjkj':
                            resultJSON = {'healthyMoney.gwjkj':sum};
                            break;
                        case 'zzjkj':
                            resultJSON = {'healthyMoney.zzjkj':sum};
                            break;
                        case 'jljkj':
                            resultJSON = {'healthyMoney.jljkj':sum};
                            break;
                    }
                    userModel.update({telNum:telNum},{$inc:resultJSON},(err,docs) => {
                        if(err) reject(err);
                        resolve({err:"扣款失败，请检查账户余额"});
                    })
                }
            })
        });
    });
}


module.exports = reduceHealthyMoney;