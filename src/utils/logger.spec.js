const tape = require('tape')
const sinon = require('sinon')
const loggerFactory = require('./logger')

sinon.spy(console, 'log')

const setup = t => {
  t.end()
}

const teardown = t => {
  t.end()
}

tape('setup', setup)

tape.test('logger logs with debug mode on', t => {
  t.equal(typeof loggerFactory, 'function')

  const debug = true

  const logger = loggerFactory(debug)

  t.equal(typeof logger, 'object')

  t.equal(typeof logger.log, 'function')

  logger.log('🍩')

  t.ok(console.log.callCount)

  t.end()
})

tape('teardown', teardown)

tape('setup', setup)

tape.skip('logger doesn\'t log with debug mode off', t => {
  const debug = true

  const logger = loggerFactory(debug)

  logger.log('🚫')

  // NOTE: problem here is that tape uses console.log behind the scenes
  //   to log, so the counts are off
  t.ok(console.log.notCalled)

  t.end()
})

tape('teardown', teardown)
