const userModel = require('../mongooseModule/model/userModel');

function getSales(){
    return new Promise((resolve,reject) => {
        userModel.find({},(err,docs) => {
            if(err) reject(err);
            for(let val of docs){
                
            }
        });
    });
}

module.exports = getSales;