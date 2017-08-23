function formatDate(month,day){
    if((month) < 10){
        month = "0" + month.toString()
    }
    if(day < 10){
        day = "0" + day.toString()
    }
    let arr = [month,day];
    return arr;
}

function reckonRandom(){
    let arr = [];
    for(let i = 0;i < 4;i++){
        arr.push(parseInt(Math.random() * 9));
    }
    return arr.join('');
}

function getOrderNum(){
    let date = new Date();
    let arr = formatDate((date.getMonth() + 1),date.getDate())
    let orderNum = [date.getFullYear() + '',arr[0],arr[1],reckonRandom()];
    return orderNum.join('');    
}

module.exports = getOrderNum;