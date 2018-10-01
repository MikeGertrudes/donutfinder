const tape = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const getNeedleMiddleware = proxyquire('./getNeedleMiddleware', {
  './../data/locations.json': {
    SLC: {
      airportCode: 'SLC',
      city: 'Salt Lake City',
      state: 'MA',
      country: 'US',
      lat: 42.3513464,
      lng: -83.6596252
    }
  }
})

tape.test('getNeedleMiddleware with no needle', t => {
  t.plan(2)

  const mock = {
    req: {
      params: {
        location: undefined
      }
    },
    res: {
      locals: {}
    },
    next: sinon.spy()
  }

  getNeedleMiddleware(mock.req, mock.res, mock.next)

  t.looseEqual(mock.next.firstCall.args[0], new Error('NEEDLE MISSING.'))

  t.equal(mock.next.callCount, 1)

  t.end()
})

tape.test('getNeedleMiddleware with bad needle', t => {
  t.plan(2)

  const mock = {
    req: {
      params: {
        location: 'xyzabc'
      }
    },
    res: {
      locals: {}
    },
    next: sinon.spy()
  }

  getNeedleMiddleware(mock.req, mock.res, mock.next)

  t.looseEqual(mock.next.firstCall.args[0], new Error('O&D: "xyzabc" NOT SUPPORTED. REDIRECTING TO HOMEPAGE.'))

  t.equal(mock.next.callCount, 1)

  t.end()
})

tape.test('getNeedleMiddleware with a pretty url', t => {
  t.plan(3)

  const mock = {
    req: {
      params: {
        location: 'salt-lake-city'
      }
    },
    res: {
      locals: {}
    },
    next: sinon.spy()
  }

  getNeedleMiddleware(mock.req, mock.res, mock.next)

  t.equal(mock.res.locals.needle, 'SLC')

  t.equal(mock.next.firstCall.args[0], undefined)

  t.equal(mock.next.callCount, 1)

  t.end()
})

tape.test('getNeedleMiddleware with classic three-character needle', t => {
  t.plan(3)

  const mock = {
    req: {
      params: {
        location: 'slc'
      }
    },
    res: {
      locals: {}
    },
    next: sinon.spy()
  }

  getNeedleMiddleware(mock.req, mock.res, mock.next)

  t.equal(mock.res.locals.needle, 'SLC')

  t.equal(mock.next.firstCall.args[0], undefined)

  t.equal(mock.next.callCount, 1)

  t.end()
})
