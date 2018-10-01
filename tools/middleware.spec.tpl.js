const tape = require('tape')
const sinon = require('sinon')
// const proxyquire = require('proxyquire')
const myMiddleware = require('./myMiddleware')

// const myMiddleware = proxyquire('./myMiddleware', {
//   './../data/file.json': {
//     property: {
//       data: true
//     }
//   }
// })

let mock = null

const setup = t => {
  const next = sinon.spy()

  mock = {
    req: {},
    res: {
      locals: {}
    },
    next
  }

  t.end()
}

const teardown = t => {
  mock = null

  t.end()
}

tape('setup', setup)

tape.test('myMiddleware is successful', t => {
  myMiddleware(mock.req, mock.res, mock.next)

  t.ok()

  t.equal(mock.next.callCount, 1)

  t.equal(mock.next.firstCall.args[0], undefined)

  t.end()
})

tape('teardown', teardown)
