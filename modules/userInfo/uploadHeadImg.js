const userModel = require('../mongooseModule/model/userModel');

function uploadHeadImg(imgPath, telNum){
    return new Promise((resolve, reject) => {
        userModel.update({telNum:telNum},{$set:{headImgPath:imgPath}},(err,docs) => {
            if(err) reject(err);
            if(docs.n == 1){
                resolve({sucessful:"上传成功"});
            }
            else{
                resolve({err:"上传失败"});
            }
        });
    });
}

module.exports = uploadHeadImg;