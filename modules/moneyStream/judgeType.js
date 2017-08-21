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
            updateJSON = {"nowMoney.jljkj":evalFunc(sum,nowMoneyObj.jljkj)}                         
        break;
        case 'gwjkj':
            updateJSON = {"nowMoney.gwjkj":evalFunc(sum,nowMoneyObj.jljkj)}   
        break;
        case 'zzjkj':
            updateJSON = {"nowMoney.zzjkj":evalFunc(sum,nowMoneyObj.jljkj)}   
        break;
        case 'ltjkj':
            updateJSON = {"nowMoney.ltjkj":evalFunc(sum,nowMoneyObj.jljkj)}   
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