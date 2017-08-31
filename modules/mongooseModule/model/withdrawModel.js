const db = require('../db');
const withdrawSchema = require('../schema/withdrawSchema');

/**
 * 发布提现模型
 */

let widthdrawModel = db.model('withdrawModel',withdrawSchema,'WithdrawCol');

module.exports = widthdrawModel;