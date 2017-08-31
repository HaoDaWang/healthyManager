const chargeModel = require('../mongooseModule/model/chargeModel');
const exportXLS = require('../exportXLS/exportXLS');

/**
 * 充值导出excel
 */

function attachFormat(target){
    if(target < 10){
        return "0" + target.toString();
    }
    return target;
}

//格式化时间
function formatTime(date){
    if(!date) return;
    let [year, month, day, hour, minute, second] = [date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
    month = attachFormat(month);
    day = attachFormat(day);
    hour = attachFormat(hour);
    minute = attachFormat(minute);
    second = attachFormat(second);
    return year+'-'+month+'-'+day+' '+hour+':'+minute+":"+second+'';
}


function chargeExportXLS(){
    return new Promise((resolve,reject) => {
        chargeModel.find({},(err,docs) => {
            if(err) reject(err);
            let cols = [
                {
                    caption:'用户名',
                    type:'string'
                },
                {
                    caption:'手机号',
                    type:'string'
                },
                {
                    caption:'充值金额',
                    type:'number'
                },
                {
                    caption:'充值方式',
                    type:'string'
                },
                {
                    caption:'充值时间',
                    type:'string'
                },
                {
                    caption:'订单号',
                    type:'string'
                },
                {
                    caption:'状态',
                    type:'string'
                }
            ];

            let rows = [];
            let time;
            for(let val of docs){
                rows.push([
                    val.userName,
                    val.telNum,
                    val.sum,
                    val.method,
                    formatTime(val.time),
                    val.orderNum,
                    val.state
                ]);
            }
            console.log(rows)
            resolve(exportXLS(cols,rows));
        })
    });
}

module.exports = chargeExportXLS;