const excelExport = require('excel-export');

/**
 * 导出excel 模块
 * @description 导出excel 根据不同的需求传递col和row
 */

function exportXLS(colsArr,rowArr){
    let conf = {};
    conf.cols = colsArr;
    conf.rows = rowArr;
    let result = excelExport.execute(conf);
    return result;
}

module.exports = exportXLS;