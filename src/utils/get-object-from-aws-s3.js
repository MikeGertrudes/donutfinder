const AWS = require('aws-sdk')

const s3 = new AWS.S3({httpOptions: { timeout: 1000 }})

const getObjectFromAWSS3 = resource => new Promise((resolve, reject) => {
  s3
    .getObject({
      Bucket: 'XXX',
      Key: resource
    }, (err, data) => {
      if (err) return reject(err)

      try {
        resolve(JSON.parse(data.Body.toString('utf-8')))
      } catch (e) {
        reject(e)
      }
    })
})

module.exports = getObjectFromAWSS3
