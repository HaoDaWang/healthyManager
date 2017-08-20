/**
 * 手机发送验证码模块
 */


function sendValidCode(telNum){
    let createValid = require('./createValidCode');
    let code = createValid()
    globalValidCode = code
    const SMSClient = require('@alicloud/sms-sdk/index');
    const accessKeyId = 'LTAI4wvnYRtFekNN'
    const secretAccessKey = 'KQCtiOnkBwo8rY1zsLJUu27vkldgET'
    let smsClient = new SMSClient({accessKeyId,secretAccessKey});
    //发送短信
    return smsClient.sendSMS({
        PhoneNumbers: telNum,
        SignName: '健康精灵',
        TemplateCode: 'SMS_86690107',
        TemplateParam: '{"validCode":"'+code+'"}'
    });
    
}

module.exports = sendValidCode;