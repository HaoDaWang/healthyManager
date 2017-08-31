/**
 * 判断类型计算模块
 */


//充值
function chargeMoney(sum,now){
    //保留两位小数
    return (parseFloat(sum) + parseFloat(now)).toFixed(2);
}
//提现
function withDraw(sum,now){
    return (parseFloat(sum) - parseFloat(now)).toFixed(2);
}

function judgeType(evalFunc,type,sum,nowMoneyObj){
    console.log('nowMoneyObj' + JSON.stringify(nowMoneyObj.jljkj));
    let updateJSON;
    switch(type){
        case 'jljkj':
            updateJSON = {"healthyMoney.jljkj":evalFunc(sum,nowMoneyObj.jljkj)}                         
        break;
        case 'gwjkj':
            updateJSON = {"healthyMoney.gwjkj":evalFunc(sum,nowMoneyObj.gwjkj)}   
        break;
        case 'zzjkj':
            updateJSON = {"healthyMoney.zzjkj":evalFunc(sum,nowMoneyObj.zzjkj)}   
        break;
        case 'ltjkj':
            updateJSON = {"healthyMoney.ltjkj":evalFunc(sum,nowMoneyObj.ltjkj)}   
        break;
        default:
            return {err:'没有匹配的健康金类型'};
        break;
    }
    return updateJSON;
}

module.exports = {
    judgeType:judgeType,
    chargeMoney:chargeMoney,
    withDraw,withDraw
}