const moment = require('moment')

const DEFAULT_FILTERS = {
  dateRange: {
    startDate: moment(),
    endDate: moment().add(2, 'weeks')
  },
  priceRange: {
    min: 0,
    max: Infinity
  }
}

const DEFAULT_SORT = {
  value: 'price ASC'
}

const getDateRange = input => {
  switch (input) {
    case 'THIS-WEEKEND':
      return {
        startDate: moment(),
        endDate: moment().add(1, 'weeks'),
        key: 'THIS-WEEKEND'
      }
    case 'THIS-WEEKEND-AND-NEXT':
      return {
        startDate: DEFAULT_FILTERS.dateRange.startDate,
        endDate: DEFAULT_FILTERS.dateRange.endDate,
        key: 'THIS-WEEKEND-AND-NEXT'
      }
    case 'NEXT-WEEKEND':
      return {
        startDate: moment().add(1, 'weeks'),
        endDate: moment().add(2, 'weeks'),
        key: 'NEXT-WEEKEND'
      }
    case 'THIS-MONTH':
      return {
        startDate: moment(),
        endDate: moment().add(1, 'month'),
        key: 'THIS-MONTH'
      }
    default:
      return undefined
  }
}

const getPriceRange = input => {
  switch (input) {
    case 'ALL-PRICES':
      return {
        min: DEFAULT_FILTERS.priceRange.min,
        max: DEFAULT_FILTERS.priceRange.max,
        key: 'ALL-PRICES'
      }
    case 'UNDER-3':
      return {
        min: 0,
        max: 3,
        key: 'UNDER-3'
      }
    case 'UNDER-5':
      return {
        min: 0,
        max: 5,
        key: 'UNDER-5'
      }
    default:
      return undefined
  }
}

const getSort = input => {
  switch (input) {
    case 'PRICE-ASC':
      return Object.assign(
        DEFAULT_SORT,
        { key: 'PRICE-ASC' }
      )
    case 'PRICE-DESC':
      return {
        value: 'price DESC',
        key: 'PRICE-DESC'
      }
    // case 'DISTANCE-ASC':
    //   return {
    //     value: 'distance ASC',
    //     key: 'DISTANCE-ASC'
    //   }
    // case 'DISTANCE-DESC':
    //   return {
    //     value: 'distance DESC',
    //     key: 'DISTANCE-DESC'
    //   }
    default:
      return undefined
  }
}

const filterAndSortMiddleware = (req, res, next) => {
  if (req.query) {
    const queryHasFilters = Object
      .keys(req.query)
      .some(key => key.startsWith('filter-'))

    if (queryHasFilters) {
      let filters

      if (req.query['filter-date']) {
        const dateRange = getDateRange(req.query['filter-date'])

        if (dateRange) {
          filters = filters || {}

          filters.dateRange = dateRange
        }
      }

      if (req.query['filter-price']) {
        const priceRange = getPriceRange(req.query['filter-price'])

        if (priceRange) {
          filters = filters || {}

          filters.priceRange = priceRange
        }
      }

      res.locals.filters = filters
    }

    if (req.query['sort']) {
      const sort = getSort(req.query['sort'])

      if (sort) res.locals.sort = getSort(req.query['sort'])
    }
  }

  next()
}

module.exports = filterAndSortMiddleware
