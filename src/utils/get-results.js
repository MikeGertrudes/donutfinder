const getObjectFromAWSS3 = require('./get-object-from-aws-s3')
const moment = require('moment')
const _ = require('lodash')
const locations = require('../data/locations.json')
const weekends = require('./weekends')(moment(), moment().add(1, 'weeks'))
const getWeather = require('./get-weather')
const logger = require('./logger')(true)

const getIndex = () => getObjectFromAWSS3('index.json')

const getCache = () => getObjectFromAWSS3('cache.json')

const parse = (key, type) => {
  switch (type) {
    case 'from':
      return key.substring(0, 3)
    case 'to':
      return key.substring(3, 6)
    case 'startDate':
      return key.substring(6, 14)
    case 'endDate':
      return key.substring(14, 22)
  }
}

const DOLLAR_SIGNS = {
  '$': {
    min: 0,
    max: 1
  },
  '$$': {
    min: 1,
    max: 3
  },
  '$$$': {
    min: 3,
    max: 5,
  },
  '$$$$': {
    min: 5,
    max: 8
  },
  '$$$$$': {
    min: 8,
    max: Infinity
  }
}

const handler = (index, cache, needle) => index[`origin=${needle}`]
  .map(found => ({
    price: cache[found][0].price,
    from: parse(found, 'from'),
    to: parse(found, 'to'),
    city: locations[parse(found, 'to')].city,
    startDate: moment(parse(found, 'startDate')).format('dddd, MMMM Do'),
    endDate: moment(parse(found, 'endDate')).format('dddd, MMMM Do'),
    duration: Math.round(moment.duration(moment().diff(moment(cache[found][0].updatedAt))).asHours()),
    merchandising: moment(parse(found, 'startDate')).isSame(moment(weekends[0].startDate))
      ? 'This weekend'
      : undefined,
    guidance: index[`origin=${parse(found, 'from')}&destination=${parse(found, 'to')}`]
      .filter(key => moment(cache[key][0].departing).isAfter(moment(), 'day'))
      .map(key => ({
        to: cache[key][0].destination,
        startDate: moment(cache[key][0].departing).format('M/D'),
        dateRange: `${moment(cache[key][0].departing).format('M/D')}—${moment(cache[key][0].returning).format('M/D')}`,
        price: cache[key][0].price,
        deeplink: `https://www.donutfinder.com`,
        selected: moment(cache[key][0].departing).isSame(parse(found, 'startDate'), 'day')
      })),
    deeplink: `https://www.donutfinder.com`,
    startDateISO: moment(parse(found, 'startDate')).toISOString()
  }))

const dateRangeFilter = (result, filters) => moment(result.startDate, 'dddd, MMMM Do').isSameOrAfter(filters.dateRange.startDate, 'day') && moment(result.startDate, 'dddd, MMMM Do').isSameOrBefore(filters.dateRange.endDate, 'day')

const priceRangeFilter = (result, filters) => ((result.price >= filters.priceRange.min) && (result.price <= filters.priceRange.max))

module.exports = (needle, options = {}, callback, errback) => {
  options = Object.assign({
      limit: null,
      offset: null,
      filters: {
        // HACK: trim off any results earlier than today's date, fix later
        // dateRange: {
        //   startDate: moment(),
        //   endDate: moment().add(3, 'year')
        // }
      },
      sort: {}
    },
    options
  )

  Promise.all([
    getIndex(),
    getCache()
  ])
    .then(response => {
      let results = handler(response[0], response[1], needle)

      const { filters, sort } = options

      const conditions = []

      if (filters.dateRange) conditions.push(dateRangeFilter)

      if (filters.priceRange) conditions.push(priceRangeFilter)

      results = results
        .filter(result => conditions.every(condition => condition(result, filters)))

      // TODO, see if we should have default sorts applied not by the request middleware (it shouldn't know about defaults)
      if (sort.value === 'price DESC') {
        results = _.orderBy(results, ['price', 'startDateISO'], ['desc', 'asc'])
      } else {
        results = _.orderBy(results, ['price', 'startDateISO'], ['asc', 'asc'])
      }

      // remove duplicate destinations after price sort
      results = _.uniqBy(results, 'to')

      const promises = []

      results.forEach(result => {
        if (result.merchandising) {
          const promise = new Promise((resolve, reject) => {
            getWeather(
              needle,
              weather => resolve(Object.assign({}, result, { weather })),
              error => {
                logger.warn(`WEATHER TIMED OUT FOR: ${result.to}.`, error)

                resolve(result)
              }
            )
          })

          promises.push(promise)
        } else {
          promises.push(Promise.resolve(result))
        }
      })

      Promise
        .all(promises)
        .then(results => callback(results))
        .catch(error => errback(error))
    })
    .catch(errback)
}
