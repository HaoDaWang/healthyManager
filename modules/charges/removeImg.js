/**
 * 删除上传的图片
 */

const fs = require('fs');
const path = require('path');
const dirPath = path.resolve(__dirname,"../../public/images");
const chargeModel =  require('../mongooseModule/model/chargeModel');

function readdir(path){
    return new Promise((resolve,reject) => {
        return fs.readdir(path,(err,files) => {
            if(err) reject(err);
            resolve(files);
        })
    });
}

function removeImgPromise(telArr){
    console.log('dirpath is ' + dirPath);
    return new Promise((resolve,reject) => {
        return (function(telArr){
            console.log(telArr);
            if(!telArr){
                console.log("111111111111111111")
                //删除所有图片
                (async function(){
                    //读取该文件夹
                    let files = await readdir(dirPath);
                    for(let val of files){
                        let filePath = dirPath +"/" +val;
                        console.log(filePath);
                        fs.unlink(filePath,err => {
                            if(err) reject(err);
                            resolve({successful:'删除成功'});                            
                        });
                    }
                })();
            }
            else{
                console.log("22222222222222")
                let queryJSON = {};
                let queryArray = [];
                for(let val of telArr){
                    queryJSON = {telNum:val}
                    queryArray.push(queryJSON)
                }
                chargeModel.find({$or:queryArray},(err,docs) => {
                    console.log(`docs----------------------${JSON.stringify(docs)}`);
                    if(err) reject(err);
                    let filePath;
                    for(let val of docs){
                        filePath = dirPath + val.imgPath.split('images')[1];
                        console.log('filepath is ' + filePath);
                        console.log(filePath);
                        fs.unlink(filePath,err => {
                            if(err) reject(err);
                            resolve({successful:'删除成功'});                            
                        });
                    }
                });
            }
        })(telArr);
    });
}

module.exports = removeImgPromise;