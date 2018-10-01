const tape = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

let templateToggle = true

const getTemplateMiddleware = proxyquire('./getTemplateMiddleware', {
  './../data/locations.json': {
    SLC: {
      airportCode: 'SLC',
      city: 'Salt Lake City',
      state: 'MA',
      country: 'US',
      lat: 42.3513464,
      lng: -83.6596252
    }
  },
  './../utils/weekends': () => ([{
    startDate: '2018-03-30',
    endDate: '2018-04-01',
    meta: {
      title: 'Easter Sunday'
    }
  }]),
  './../utils/get-template': (props, include, callback, errback) => {
    templateToggle
      ? callback(`<html><head><title>${props.title}</title></head><body></body></html>`)
      : errback(new Error)
  }
})

let mock = null

const setup = t => {
  const next = sinon.spy()

  mock = {
    req: {},
    res: {
      locals: {
        needle: 'SLC',
        results: [{
          price: 5,
          to: 'NYC',
          from: 'SLC'
        }, {
          price: 1,
          to: 'BOS',
          from: 'SLC'
        }],
        links: [{
          href: '/from/slc/',
          title: 'Find Donuts in SLC'
        }],
        filters: undefined,
        sort: undefined,
        subdomain: {
          key: 'cheaptasty',
          title: 'Cheap Tasty'
        }
      }
    },
    next
  }

  t.end()
}

const teardown = t => {
  mock = null

  templateToggle = true

  t.end()
}

tape('setup', setup)

tape.test('getTemplateMiddleware successfully', t => {
  t.plan(4)

  getTemplateMiddleware(mock.req, mock.res, mock.next)

  setTimeout(() => {
    t.ok(mock.res.locals.html)

    t.ok(mock.res.locals.html.includes('<title>Find Cheap Tasty Donuts from Salt Lake City from as little as $1</title>'))

    t.equal(mock.next.callCount, 1)

    t.equal(mock.next.firstCall.args[0], undefined)

    t.end()
  }, 0)
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('getTemplateMiddleware unsuccessfully', t => {
  t.plan(3)

  templateToggle = false

  getTemplateMiddleware(mock.req, mock.res, mock.next)

  setTimeout(() => {

    t.notOk(mock.res.locals.html)

    t.equal(mock.next.callCount, 1)

    t.looseEquals(mock.next.firstCall.args[0], new Error)

    t.end()
  }, 0)
})

tape('teardown', teardown)
