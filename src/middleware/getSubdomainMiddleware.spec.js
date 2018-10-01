const tape = require('tape')
const sinon = require('sinon')
const getSubdomainMiddleware = require('./getSubdomainMiddleware')

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

tape.test('getSubdomainMiddleware with no subdomain query', t => {
  t.plan(3)

  mock.req.query = undefined

  getSubdomainMiddleware(mock.req, mock.res, mock.next)

  t.notOk(mock.res.locals.subdomain)

  t.equal(mock.next.callCount, 1)

  t.equal(mock.next.firstCall.args[0], undefined)

  t.end()
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('getSubdomainMiddleware with valid subdomain query', t => {
  t.plan(3)

  mock.req.query = {
    sd: 'cheap'
  }

  getSubdomainMiddleware(mock.req, mock.res, mock.next)

  t.deepEquals(mock.res.locals.subdomain, {
    key: 'cheap',
    title: 'Cheap'
  })

  t.equal(mock.next.callCount, 1)

  t.equal(mock.next.firstCall.args[0], undefined)

  t.end()
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('getSubdomainMiddleware with valid subdomain query', t => {
  t.plan(1)

  mock.req.query = {
    sd: 'tasty'
  }

  getSubdomainMiddleware(mock.req, mock.res, mock.next)

  t.deepEquals(mock.res.locals.subdomain, {
    key: 'tasty',
    title: 'Tasty'
  })

  t.end()
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('getSubdomainMiddleware with valid subdomain query', t => {
  t.plan(1)

  mock.req.query = {
    sd: 'cheaptasty'
  }

  getSubdomainMiddleware(mock.req, mock.res, mock.next)

  t.deepEquals(mock.res.locals.subdomain, {
    key: 'cheaptasty',
    title: 'Cheap Tasty'
  })

  t.end()
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('getSubdomainMiddleware with invalid subdomain query', t => {
  t.plan(1)

  mock.req.query = {
    sd: 'old'
  }

  getSubdomainMiddleware(mock.req, mock.res, mock.next)

  t.notOk(mock.res.locals.subdomain)

  t.end()
})

tape('teardown', teardown)
