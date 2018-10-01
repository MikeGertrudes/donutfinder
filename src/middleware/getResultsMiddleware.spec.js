const tape = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const mockResults = [{
  price: 1
}, {
  price: 2
}, {
  price: 3
}]

let mock = null

let mockMe = null

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

const getResultsMiddleware = proxyquire('./getResultsMiddleware', {
  './../utils/get-results': (x, y, callback, errback) => mockMe(x, y, callback, errback)
})

tape('setup', setup)

tape.test('getResultsMiddleware working default with getResults returning results with no filters', t => {
  t.plan(3)

  mockMe = (x, y, callback, errback) => {
    callback(mockResults)
  }

  getResultsMiddleware(mock.req, mock.res, mock.next)

  t.deepEqual(mock.res.locals.results, mockResults)

  t.equal(mock.next.callCount, 1)

  t.equal(mock.next.firstCall.args[0], undefined)

  t.end()
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('getResultsMiddleware working default with getResults returning results with filters', t => {
  t.plan(3)

  mock.res.locals = {
    filters: {},
    sort: {}
  }

  mockMe = (x, y, callback, errback) => {
    callback(mockResults)
  }

  getResultsMiddleware(mock.req, mock.res, mock.next)

  t.deepEqual(mock.res.locals.results, mockResults)

  t.equal(mock.next.callCount, 1)

  t.equal(mock.next.firstCall.args[0], undefined)

  t.end()
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('getResultsMiddleware working default with getResults returning empty results', t => {
  t.plan(3)

  mockMe = (x, y, callback, errback) => {
    callback([])
  }

  getResultsMiddleware(mock.req, mock.res, mock.next)

  t.equal(mock.next.callCount, 1)

  t.looseEqual(mock.next.firstCall.args[0], new Error())

  t.notOk(mock.res.locals.results)

  t.end()
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('getResultsMiddleware broken with getResults returning an error', t => {
  t.plan(2)

  mockMe = (x, y, callback, errback) => {
    errback(new Error())
  }

  getResultsMiddleware(mock.req, mock.res, mock.next)

  t.equal(mock.next.callCount, 1)

  t.looseEqual(mock.next.firstCall.args[0], new Error())

  t.end()
})

tape('teardown', teardown)
