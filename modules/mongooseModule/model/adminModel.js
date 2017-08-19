let adminSchema = require('../schema/adminSchema');
let db = require('../db');

//发布模型
let adminModel = db.model('adminModel',adminSchema,'AdminCol');

module.exports = adminModel;