const userModel = require('../mongooseModule/model/userModel');

/**
 * 搜索模块
 * @description 有搜索页面使用
 * 一共四个搜索选项
 * 手机号
 * 用户名
 * 开始日期
 * 结束日期
*/

//删除数组元素
function removeArrayEle(arr,value){
    let index = arr.indexOf(value);
    arr.splice(index,1);
    return arr;
}

function search(telNum,userName,start,end){
    return new Promise((resolve,reject) => {
        //封装为查询JSON对象
        let queryArray = [];
        if(telNum) queryArray.push({telNum:telNum});
        if(userName) queryArray.push({userName:userName});
        if(start && end){
            queryArray.push({registeTime:{$gte:new Date(start),$lt:new Date(end)}});
        }
        else if(start){
            queryArray.push({registeTime:{$gte:new Date(start)}})
        }
        else if(end){
            queryArray.push({registeTime:{$lt:new Date(end)}})
        }

        userModel.find({$and:queryArray},(err,docs) => {
            if(err) reject(err);
            resolve(docs);
        })
    })
}

module.exports = search;