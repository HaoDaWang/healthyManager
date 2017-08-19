/**
 * 随机创建验证码模块
 */


function createValidCode(){
    let validArr = [];
    for(let i = 0;i < 6;i++){
        validArr.push(parseInt(Math.random() * 9))
    }
    return validArr.join('')
}

module.exports = createValidCode