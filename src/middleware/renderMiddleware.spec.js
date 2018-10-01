const tape = require('tape')
const sinon = require('sinon')
const renderMiddleware = require('./renderMiddleware')

tape.test('renderMiddleware', t => {
  t.plan(3)

  let statusPayload = null

  const mock = {
    req: {},
    res: {
      setHeader: sinon.spy(),
      status: sinon.spy(() => statusPayload),
      send: sinon.spy(),
      locals: {
        html: '<h1>🍩🔎</h1>'
      }
    },
    next: () => {},
  }

  statusPayload = mock.res

  renderMiddleware(mock.req, mock.res, mock.next)

  t.deepEqual(mock.res.setHeader.firstCall.args, ['Content-Type', 'text/html'])

  t.equal(mock.res.status.firstCall.args[0], 200)

  t.equal(mock.res.send.firstCall.args[0], '<h1>🍩🔎</h1>')

  t.end()
})
