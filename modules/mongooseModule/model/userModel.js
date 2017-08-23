let userSchema = require('../schema/userSchema');
let db = require('../db');

//发布模型
let userModel = db.model('userModel',userSchema,'UserCol');

module.exports = userModel;

