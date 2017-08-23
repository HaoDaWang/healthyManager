let chargeModel = require('../mongooseModule/model/chargeModel');

function getAllChargePromise (){
    return new Promise((resolve,reject) => {
        return (function(){
            chargeModel.find({},(err,docs) => {
                if(err) reject(err);
                resolve({successful:docs})
            });
        })();
    });
}

module.exports = getAllChargePromise;