const tape = require('tape')
const proxyquire = require('proxyquire').noCallThru()

const getLinksMiddleware = proxyquire('./getLinksMiddleware', {
  './../data/locations.json': {
    ABC: {
      airportCode: 'ABC',
      city: 'ABCville',
      state: 'MA',
      country: 'US',
      lat: 42.3513464,
      lng: -83.6596252
    }
  }
})

tape.test('getLinksMiddleware', t => {
  t.plan(1)

  const mock = {
    req: {},
    res: {
      locals: {}
    },
    next: () => {}
  }

  getLinksMiddleware(mock.req, mock.res, mock.next)

  t.deepEqual(mock.res.locals.links, [{
    href: '/from/abc/',
    title: '🍩🔎 ABC'
  }, {
    href: '/from/abcville/',
    title: '🍩🔎 ABCville'
  }])

  t.end()
})
