'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' })
const SES = new AWS.SES()

const sendEmail = async function (formData) {

  const getContent = (formData) => {
    let retval = ''
    for (var attribName in formData){
      retval += attribName + ': ' + formData[attribName] + '\n\n'
    }
    return retval
  }
  
  return new Promise(async (resolve, reject) => {

    // Build params for SES
    const emailParams = {
      Source: process.env.FromAddress, // SES SENDING EMAIL
      ReplyToAddresses: [process.env.ReplyToAddresses],
      Destination: {
        ToAddresses: [process.env.ToAddresses], // SES RECEIVING EMAIL
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: getContent(formData)
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'New Form Submission'
        },
      },
    }
    // Send the email
    try {
      const result = await SES.sendEmail(emailParams).promise()
      console.log('sendEmail result: ', result)
      resolve()
    } catch (err) {
      console.error('sendEmail error: ', err)
      reject()
    }
  })
}

module.exports = { sendEmail }