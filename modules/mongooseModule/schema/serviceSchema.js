const mongoose = require('mongoose');

/**
 * 123456星服务
 */

let serviceSchema = new mongoose.Schema({
    star:{type:Number},
    content:{type:Array},
    price:{type:String},
    money:{type:Number}
});

module.exports = serviceSchema;