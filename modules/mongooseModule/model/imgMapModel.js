const imgMapSchema = require('../schema/imgMapSchema');
const db = require('../db');

/**
 * img路径映射 模型
 */

let imgMapModel = db.model('imgMapModel',imgMapSchema,'ImgMapCol')

module.exports = imgMapModel;