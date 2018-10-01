const tape = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

let awsToggle = true

const getResults = proxyquire('./get-results', {
  './get-object-from-aws-s3': file => {
    if (!awsToggle) return Promise.reject(new Error)

    if (file === 'cache.json') {
      return Promise.resolve({
        'NYCLAX2019033020190401': [
          {
            'key':'NYCLAX2019033020190401',
            'price': 651,
            'source': 'XXX',
            'origin': 'NYC',
            'destination':'LAX',
            'departing': '2019-03-30',
            'returning':'2019-04-01',
            'updatedAt': new Date().toISOString(),  // NOTE: moment current time problem, fixed
            'createdAt':'2019-04-08T03:29:21.445Z',
          },
          {
            'key':'NYCLAX2019033020190401',
            'price': 717,
            'source': 'XXX',
            'origin': 'NYC',
            'destination':'LAX',
            'departing': '2019-03-30',
            'returning':'2019-04-01',
            'updatedAt': new Date().toISOString(),
            'createdAt':'2019-04-08T03:29:21.445Z',
          }
        ],
        'NYCLAS2019033020190401': [
          {
            'key':'NYCLAS2019033020190401',
            'price': 475,
            'source': 'XXX',
            'origin': 'NYC',
            'destination':'LAS',
            'departing': '2019-03-30',
            'returning':'2019-04-01',
            'updatedAt': new Date().toISOString(),
            'createdAt':'2019-04-08T03:29:21.445Z',
          }
        ],
        'NYCLAX2019050420190506': [
          {
            'key':'NYCLAX2019050420190506',
            'price': 200,
            'source': 'XXX',
            'origin': 'NYC',
            'destination':'LAX',
            'departing': '2019-05-04',
            'returning':'2019-05-06',
            'updatedAt': new Date().toISOString(),
            'createdAt':'2019-04-08T03:29:21.445Z',
          }
        ]
      })
    } else {
      return Promise.resolve({
        'origin=NYC': [
          'NYCLAS2019033020190401',
          'NYCLAX2019033020190401',
          'NYCLAX2019050420190506'
        ],
        'origin=NYC&destination=LAX': [
          'NYCLAX2019033020190401',
          'NYCLAX2019050420190506'
        ],
        'origin=NYC&destination=LAS': [
          'NYCLAS2019033020190401'
        ]
      })
    }
  },
  '../data/locations.json': {
    NYC: {
      airportCode: 'NYC',
      city: 'New York',
      state: 'NY',
      country: 'US',
      lat: 42.3513464,
      lng: -83.6596252
    }
  },
  './weekends': () => ([{
    startDate: '2019-03-30',
    endDate: '2019-04-01',
    meta: {
      title: 'Easter Sunday'
    }
  }, {
    startDate: '2019-05-04',
    endDate: '2019-05-06',
    meta: {
      title: 'Cinco de Mayo'
    }
  }]),
  './get-weather': (needle, callback, errback) => callback('🌧')
})

const setup = t => {
  t.end()
}

const teardown = t => {
  awsToggle = true

  t.end()
}

tape('setup', setup)

tape.test('getResults is successful', t => {
  t.plan(2)

  const callback = sinon.spy()

  getResults('NYC', {}, callback, () => {})

  setTimeout(() => {
    t.ok(callback.called)

    t.deepEquals(callback.firstCall.args[0], [{
      price: 200,
      from: 'NYC',
      to: 'LAX',
      city: 'Los Angeles',
      startDate: 'Saturday, May 4th',
      endDate: 'Monday, May 6th',
      duration: 0,
      merchandising: undefined,
      guidance: [{
        to: 'LAX',
        startDate: '3/30',
        dateRange: '3/30—4/1',
        price: 651,
        deeplink: 'https://www.donutfinder.com',
        selected: false
      }, {
        to: 'LAX',
        startDate: '5/4',
        dateRange: '5/4—5/6',
        price: 200,
        deeplink: 'https://www.donutfinder.com',
        selected: true
      }],
      deeplink: 'https://www.donutfinder.com',
      startDateISO: '2019-05-04T04:00:00.000Z'
    }, {
      price: 475,
      from: 'NYC',
      to: 'LAS',
      city: 'Las Vegas',
      startDate: 'Saturday, March 30th',
      endDate: 'Monday, April 1st',
      duration: 0,
      merchandising: 'This weekend',
      guidance: [{
        to: 'LAS',
        startDate: '3/30',
        dateRange: '3/30—4/1',
        price: 475,
        deeplink: 'https://www.donutfinder.com',
        selected: true
      }],
      deeplink: 'https://www.donutfinder.com',
      startDateISO: '2019-03-30T04:00:00.000Z',
      weather: '🌧'
    }])

    t.end()
  }, 0)
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('getResults is unsuccessful', t => {
  t.plan(2)

  awsToggle = false

  const errback = sinon.spy()

  getResults('NYC', {}, () => {}, errback)

  setTimeout(() => {
    t.ok(errback.called)

    t.looseEquals(errback.firstCall.args[0], new Error)

    t.end()
  }, 0)
})

tape('teardown', teardown)
