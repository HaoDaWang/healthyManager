const mongoose = require('mongoose');

/**
 *  上传图片路径映射集合
 *  @description 用于检测是否重复提交表单
 */

let imgMapSchema = new mongoose.Schema({
    imgPath:{type:String}
});

module.exports = imgMapSchema;