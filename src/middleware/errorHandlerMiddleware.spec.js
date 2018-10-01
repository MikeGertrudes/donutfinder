const tape = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const error = sinon.spy()

const errorHandlerMiddleware = proxyquire('./errorHandlerMiddleware', {
  './../utils/logger': () => {
    return {
      error
    }
  }
})

tape.test('errorHandlerMiddleware', t => {
  t.plan(2)

  process.env.DEBUG = true

  const err = new Error('I CAN\'T FIND MY DONUT!')

  const mock = {
    err,
    req: {},
    res: {
      redirect: sinon.spy()
    },
    next: () => {}
  }

  errorHandlerMiddleware(mock.err, mock.req, mock.res, mock.next)

  t.equal(mock.res.redirect.firstCall.args[0], '/')

  t.looseEqual(error.firstCall.args[0], new Error('I CAN\'T FIND MY DONUT!'))

  t.end()
})
