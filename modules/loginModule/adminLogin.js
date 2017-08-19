let adminModel = require('../mongooseModule/model/adminModel');

let adminLoginPromise = (telNum,passw) => {
    return new Promise((resolve,reject) => {
        return (function adminLogin(telNum,passw){
            adminModel.find({telNum:telNum,passw:passw},(err,docs) => {
                if(err) reject({ err:JSON.stringify(err) });
                resolve({ successful:docs })
            });
        })(telNum,passw);
    });
}

module.exports = adminLoginPromise;