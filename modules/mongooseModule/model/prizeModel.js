const prizeSchema = require('../schema/prizeSchema');
const db = require('../db');

/**
 * 根据大盘数据架构发布数据模块
 */

let prizeModel = db.model("prizeModel",prizeSchema,"PrizeCol");

module.exports = prizeModel;