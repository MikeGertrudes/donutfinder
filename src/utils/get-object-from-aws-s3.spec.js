const tape = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

let awsToggle = true

const getObjectFromAWSS3 = proxyquire('./get-object-from-aws-s3', {
  'aws-sdk': {
    S3: function S3() {
      this.getObject = function(bucket, fn) {
        awsToggle
          ? fn(
            null,
            // NOTE: this is very strange, toString('utf-8')
            //   must need all numbers or something
            {
              Body: '12102102312010220102014212'
            }
          )
          : fn(new Error)
      }
    }
  }
})

const setup = t => {
  t.end()
}

const teardown = t => {
  awsToggle = false

  t.end()
}

tape('setup', setup)

tape.test('getObjectFromAWSS3 is successful', t => {
  t.plan(2)

  const promise = getObjectFromAWSS3('file')

  t.ok(promise instanceof Promise)

  promise
    .then(response => {
      t.ok(response)

      t.end()
    })
})

tape('teardown', teardown)

tape('setup', setup)

tape.skip('getObjectFromAWSS3 is unsuccessful', t => {
  t.plan(1)

  awsToggle = false

  const promise = getObjectFromAWSS3('badfile')

  promise
    .catch(error => {
      t.ok(error)

      t.end()
    })
})

tape('teardown', teardown)
