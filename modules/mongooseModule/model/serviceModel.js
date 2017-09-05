const db = require('../db');
const serviceSchema = require('../schema/serviceSchema');

let serviceModel = db.model('serviceModel',serviceSchema,'ServiceCol');

module.exports = serviceModel;