const userModel = require('../mongooseModule/model/userModel');

/**
 * 判断等级模块
 * @description 在需要的时候调用此模块判断等级，进行等级变更
 * VIP 5 个等级：
 * silver
 * gold
 * drill
 * intercontinental
 * HLB-WG
 */

//定义等级数组
let VIPEnum = [null,'silver','gold','drill','intercontinental','HLB-WG'];

//修改VIP等级
function editVIP(telNum,VIP){
    userModel.update({telNum:telNum},{$set:{VIP:VIP}},(err,docs) => {
        if(err) console.log('修改等级失败')
    })
}

//判断逻辑函数
function affiliatedjudgeVIP(telNum,teamInform,VIPEnum,level){
    let teamInformVIPArr = [];
    //查询下线，拼接下线查询JSON
    for(let i = 0;i < teamInform.length;i++){
        teamInformVIPArr.push({telNum:teamInform[i]});                   
    }
    //查询下线
    userModel.find({$or:teamInformVIPArr},(err,docs) => {
        if(err) reject(err);
        let count = 0;
        for(let i = 0;i < docs.length;i++){
            console.log(docs[i].VIP)
            if(docs[i].VIP == level){
                count++;
            }
        }
            console.log("asdasd");
        
        //判断是否超过两个
        console.log(VIPEnum.indexOf(level) + 1);
        if(count >= 2){
            console.log("asdasdsdaasd`1`154354`1");
            editVIP(telNum,VIPEnum[(VIPEnum.indexOf(level) + 1)]);
        }
    });
}

function judgeVIP(telNum){
    return new Promise((resolve,reject) => {
        userModel.find({telNum:telNum},(err,docs) => {
            if(err) reject(err);
            //下线成员名单
            let teamInform = docs[0].teamInform;
            let VIP = docs[0].VIP;
            //存在VIP的字段
            if(VIP == '无'){
                if(teamInform.length >= 2){
                    editVIP(telNum,'silver');
                }
            }
            else if(VIP == 'silver'){
                affiliatedjudgeVIP(telNum,teamInform,VIPEnum,'silver');
            }
            else if(VIP == 'gold'){
                affiliatedjudgeVIP(telNum,teamInform,VIPEnum,'gold');
            }
            else if(VIP == 'drill'){
                affiliatedjudgeVIP(telNum,teamInform,VIPEnum,'drill');
            }
            else if(VIP == 'intercontinental'){
                affiliatedjudgeVIP(telNum,teamInform,VIPEnum,'intercontinental');
            }
            else{
                //最高等级
            }
            resolve({successful:"检查更新等级完成"});
        })
    });
}


module.exports = judgeVIP;