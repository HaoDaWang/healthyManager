/**
 * 手机发送验证码模块
 */


function sendValidCode(telNum){
    let createValid = require('./createValidCode');
    let code = createValid()
    const SMSClient = require('@alicloud/sms-sdk/index');
    const accessKeyId = 'LTAI4wvnYRtFekNN'
    const secretAccessKey = 'KQCtiOnkBwo8rY1zsLJUu27vkldgET'
    let smsClient = new SMSClient({accessKeyId,secretAccessKey});
    //发送短信
    return new Promise((resolve,reject) => {
        return smsClient.sendSMS({
            PhoneNumbers: telNum,
            SignName: '健康精灵',
            TemplateCode: 'SMS_86690107',
            TemplateParam: '{"validCode":"'+code+'"}'
        }).then(data => {
            let {Code}=data
            if (Code === 'OK') {
                //处理返回参数
                console.log(data)
                resolve({code:code})
            }
        }).catch(err => {
            console.log(err)
        });
    })
     
    
}

module.exports = sendValidCode;