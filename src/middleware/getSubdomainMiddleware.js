const SUBDOMAINS = {
  'cheap': {
    key: 'cheap',
    title: 'Cheap'
  },
  'tasty': {
    key: 'tasty',
    title: 'Tasty'
  },
  'cheaptasty': {
    key: 'cheaptasty',
    title: 'Cheap Tasty'
  }
}

const getSubdomainMiddleware = (req, res, next) => {
  if (req.query && req.query['sd']) {
    const subdomain = SUBDOMAINS[req.query['sd']]

    if (subdomain) res.locals.subdomain = subdomain
  }

  next()
}

module.exports = getSubdomainMiddleware
