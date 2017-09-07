const userModel = require('../mongooseModule/model/userModel');
const getTeamInfo = require('./getTeamInfo');

function getAchievement(){
    return new Promise((resolve,reject) => {
       userModel.find({},(err,docs) => {
            if(err) reject(err);
            (async function(){
                let arr = [];
                for(let val of docs){
                    let result = await getTeamInfo(val.telNum);
                    arr.push({userName:val.userName,telNum:val.telNum,info:result});
                }
                resolve({successful:arr});
            })();
        });
    });
}

module.exports = getAchievement;