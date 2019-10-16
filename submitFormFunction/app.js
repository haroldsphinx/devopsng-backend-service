'use strict'

const { saveFormData } = require('./dynamodb')
const { sendEmail } = require('./ses')

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,POST"
}

// Main Lambda entry point
exports.handler = async (event) => {

    console.log(`Started with: ${event.body}`)
    const formData = JSON.parse(event.body)
    
    try {
      // Send email and save to DynamoDB in parallel using Promise.all
      await Promise.all([sendEmail(formData), saveFormData(formData)])
      
      return {
          statusCode: 200,
          body: 'OK!',
          headers        
      }
    } catch(err) {
      console.error('handler error: ', err)  

      return {
          statusCode: 500,
          body: 'Error',
          headers    
      }
    }
}
