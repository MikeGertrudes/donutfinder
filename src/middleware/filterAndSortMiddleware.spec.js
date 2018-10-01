const tape = require('tape')
const sinon = require('sinon')
const moment = require('moment')
const filterAndSortMiddleware = require('./filterAndSortMiddleware')

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

tape.test('filterAndSortMiddleware with no values', t => {
  t.plan(4)

  filterAndSortMiddleware(mock.req, mock.res, mock.next)

  t.notOk(mock.res.locals.filters)

  t.notOk(mock.res.locals.sort)

  t.equal(mock.next.callCount, 1)

  t.equal(mock.next.firstCall.args[0], undefined)

  t.end()
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('filterAndSortMiddleware with bad queries to trigger default', t => {
  t.plan(4)

  mock.req.query = {
    'filter-date': 'DARRYL',
    'filter-price': 'STRAWBERRY',
    'sort': '#44'
  }

  filterAndSortMiddleware(mock.req, mock.res, mock.next)

  t.notOk(mock.res.locals.filters)

  t.notOk(mock.res.locals.sort)

  t.equal(mock.next.callCount, 1)

  t.equal(mock.next.firstCall.args[0], undefined)

  t.end()
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('filterAndSortMiddleware with values for each', t => {
  t.plan(8)

  mock.req.query = {
    'filter-date': 'THIS-WEEKEND',
    'filter-price': 'ALL-PRICES',
    'sort': 'PRICE-ASC'
  }

  filterAndSortMiddleware(mock.req, mock.res, mock.next)

  t.ok(mock.res.locals.filters)

  // NOTE: needed to do this on account of them being a split second off
  t.ok(mock.res.locals.filters.dateRange.startDate.isSame(moment(), 'day'))

  t.ok(mock.res.locals.filters.dateRange.endDate.isSame(moment().add(1, 'weeks'), 'day'))

  t.deepEqual(mock.res.locals.filters.priceRange, {
    min: 0,
    max: Infinity,
    key: 'ALL-PRICES'
  })

  t.ok(mock.res.locals.sort)

  t.deepEqual(mock.res.locals.sort, {
    value: 'price ASC',
    key: 'PRICE-ASC'
  })

  t.equal(mock.next.callCount, 1)

  t.equal(mock.next.firstCall.args[0], undefined)

  t.end()
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('filterAndSortMiddleware for edge cases 1', t => {
  t.plan(4)

  mock.req.query = {
    'filter-date': 'THIS-WEEKEND-AND-NEXT',
    'filter-price': 'UNDER-3',
    'sort': 'PRICE-DESC'
  }

  filterAndSortMiddleware(mock.req, mock.res, mock.next)

  // NOTE: needed to do this on account of them being a split second off
  t.ok(mock.res.locals.filters.dateRange.startDate.isSame(moment(), 'day'))

  t.ok(mock.res.locals.filters.dateRange.endDate.isSame(moment().add(2, 'weeks'), 'day'))

  t.equal(mock.res.locals.filters.priceRange.max, 3)

  t.equal(mock.res.locals.sort.value, 'price DESC')

  t.end()
})

tape('teardown', teardown)

tape('setup', setup)

tape.test('filterAndSortMiddleware for edge cases 2', t => {
  t.plan(3)

  mock.req.query = {
    'filter-price': 'UNDER-5',
  }

  filterAndSortMiddleware(mock.req, mock.res, mock.next)

  t.equal(mock.res.locals.filters.priceRange.max, 5)

  t.notOk(mock.res.locals.filters.dateRange)

  t.notOk(mock.res.locals.sort)

  t.end()
})

tape('teardown', teardown)
