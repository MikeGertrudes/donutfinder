const tape = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

let timeoutToggle = true

const requestSpy = sinon.spy((url, options, fn) => {
  timeoutToggle
    ? fn(
        null,
        {
          statusCode: 200,
        },
        JSON.stringify({
          daily: {
            icon: 'sleet'
          }
        })
      )
    : fn(new Error)
})

const getWeather = proxyquire('./get-weather', {
  'request': requestSpy,
  './../data/locations': {
    'NYC': {
      lat: 40.123,
      lng: -80.123
    }
  }
})

const setup = t => {
  t.end()
}

const teardown = t => {
  timeoutToggle = true

  t.end()
}

tape('setup', setup)

tape.test('getWeather is successful', t => {
  const callback = sinon.spy()

  const test = getWeather('NYC', callback, () => {})

  t.ok(requestSpy.called)

  t.equal(requestSpy.firstCall.args[0], 'https://api.donutfinder.com/weather/40.123,-80.123')

  t.ok(callback.called)

  t.equal(callback.firstCall.args[0], '🌨')

  t.end()
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('getWeather is unsuccessful', t => {
  const errback = sinon.spy()

  timeoutToggle = false

  const test = getWeather('NYC', () => {}, errback)

  t.ok(errback.called)

  t.end()
})

tape('teardown', teardown)
