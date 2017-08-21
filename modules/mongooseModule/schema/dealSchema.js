const mongoose = require('mongoose');

/**
 * 交易集合
 */

let dealSchema = new mongoose.Schema({
    telNum:{type:String},
    charge:{type:Array},
    withdraw:{type:Array},
    transfer:{type:Array},
    exchange:{type:Array}
});

module.exports = dealSchema;