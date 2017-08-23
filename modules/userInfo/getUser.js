const userModel = require('../mongooseModule/model/userModel');

function getUserPromise(telNum){
    return new Promise((resolve,reject) => {
        userModel.find({telNum:telNum},(err, docs) => {
            if(err) reject(err);
            console.log(docs);
            resolve({successful:docs})
        })
    });
}


module.exports = getUserPromise;