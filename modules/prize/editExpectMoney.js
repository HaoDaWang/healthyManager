const prizeModel = require('../mongooseModule/model/prizeModel');

function editTotalMoney(expectMoney){
    return new Promise((resolve,reject) => {
        prizeModel.update({},{$set:{expectMoney:expectMoney}},(err,docs) => {
            if(err) reject(err);
            resolve({successful:'修改成功'});
        });
    });
}

module.exports = editTotalMoney;