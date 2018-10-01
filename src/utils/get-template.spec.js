const tape = require('tape')
const sinon = require('sinon')
const getTemplate = require('./get-template')

const setup = t => {
  t.end()
}

const teardown = t => {
  t.end()
}

tape('setup', setup)

tape.test('getTemplate is successful', t => {
  t.plan(2)

  const callback = sinon.spy()

  const props = {
    title: '🍩 in NYC', 
    from: 'NYC',
    city: 'New York City'
  }

  getTemplate(
    Object.assign({},
      props,
      {
        head: '<head><title>🍩 in NYC</title></head>',
        header: '<header></header>',
        jumbotron: '<section></section>',
        cards: '<ul></ul>',
        map: '<div></div>',
        footer: '<footer></footer>'
      }
    ),
    'index',
    callback,
    () => {}
  )

  // NOTE: this is bad, hardcoding the time to wait for the file to load
  //   might be worth mocking fs
  const wait = 1000

  setTimeout(() => {
    t.ok(callback.called)

    t.ok(callback.firstCall.args[0].includes('<title>🍩 in NYC'))

    t.end()
  }, wait)

})

tape('teardown', teardown)
