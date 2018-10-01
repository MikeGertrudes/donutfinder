const tape = require('tape')
const sinon = require('sinon')
// const proxyquire = require('proxyquire')
const myUtil = require('./myUtil')

// const myUtil = proxyquire('./myUtil', {
//   './../data/file.json': {
//     property: {
//       data: true
//     }
//   }
// })

const setup = t => {
  t.end()
}

const teardown = t => {
  t.end()
}

tape('setup', setup)

tape.test('myUtil is successful', t => {
  const test = myUtil()

  t.ok(test)

  t.equal(test.value, 'something')

  t.end()
})

tape('teardown', teardown)
