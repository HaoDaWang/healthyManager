const dealSchema = require('../schema/dealSchema');
const db = require('../db');

//发布模型
let dealModel = db.model('dealModel',dealSchema,'DealCol');

module.exports = dealModel;