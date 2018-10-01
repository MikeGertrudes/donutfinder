const getResults = require('./../utils/get-results')

const getResultsMiddleware = (req, res, next) => {
  getResults(res.locals.needle,
    Object.assign({},
      res.locals.filters ? { filters: res.locals.filters } : {},
      res.locals.sort ? { sort: res.locals.sort } : {}
    ),
    results => {
      if (!results.length) return next(new Error(`O&D: "${res.locals.needle}" NOT SUPPORTED. REDIRECTING TO HOMEPAGE.`))

      res.locals.results = results

      next()
    },
    error => next(error)
)}

module.exports = getResultsMiddleware
