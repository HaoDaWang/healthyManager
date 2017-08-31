const userModel = require('../mongooseModule/model/userModel');

function limitPage(skip,pageCount){
    return new Promise((resolve,reject) => {
        userModel.find({},null,{skip:skip,limit:pageCount},(err,docs) => {
            if(err) reject(err);
            resolve({successful:docs});
        })
    })
}

module.exports = limitPage;