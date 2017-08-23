const chargeSchema = require('../schema/chargeSchema');
const db = require('../db');

//发布模型
let chargeModel = db.model('chargeModel',chargeSchema,'ChargeCol');

module.exports = chargeModel;