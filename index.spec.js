const tape = require('tape')
const supertest = require('supertest')
const proxyquire = require('proxyquire')

let resultsToggle = true

const app = proxyquire('./index', {
  './src/middleware/getResultsMiddleware': (req, res, next) => {
    if (resultsToggle) {
      res.locals.results = [{
        price: 1,
        to: 'SLC',
        from: 'NYC'
      }, {
        price: 5,
        to: 'BOS',
        from: 'NYC'
      }]

      next()
    } else {
      next(new Error)
    }
  }
})

const setup = t => {
  t.end()
}

const teardown = t => {
  resultsToggle = true

  app.close()

  t.end()
}

tape('setup', setup)

tape.test('GET /', t => {
  supertest(app)
    .get('/')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .end((err, res) => {
        t.notOk(err)

        t.ok(res)

        t.ok(res.text.includes('<title>Find Donuts</title>'))

        t.end()
      })
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('GET /from/nyc/', t => {
  supertest(app)
    .get('/from/nyc/')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .end((err, res) => {
        t.notOk(err)

        t.ok(res)

        t.ok(res.text.includes('<title>Find Donuts from New York from as little as $1</title>'))

        t.end()
      })
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('GET /from/nyc/ with successful results', t => {
  supertest(app)
    .get('/from/nyc/')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .end((err, res) => {
        t.notOk(err)

        t.ok(res)

        t.ok(res.text.includes('<title>Find Donuts from New York from as little as $1</title>'))

        t.end()
      })
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('GET /from/nyc/ from subdomain with successful results', t => {
  supertest(app)
    .get('/from/nyc/?sd=cheaptasty')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .end((err, res) => {
        t.notOk(err)

        t.ok(res)

        t.ok(res.text.includes('<title>Find Cheap Tasty Donuts from New York from as little as $1</title>'))

        t.end()
      })
})

tape('teardown', teardown)


tape('setup', setup)

tape.test('GET from location with unsuccessful results', t => {
  resultsToggle = false

  supertest(app)
    .get('/from/nyc/')
      .expect(302)
      .expect('Content-Type', /text\/plain/)
      .end((err, res) => {
        t.equal(res.status, 302)

        t.end()
      })
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('GET from bad location', t => {
  supertest(app)
    .get('/from/abcville/')
      .expect(302)
      .expect('Content-Type', /text\/plain/)
      .end((err, res) => {
        t.equal(res.status, 302)

        t.end()
      })
})

tape('teardown', teardown)
