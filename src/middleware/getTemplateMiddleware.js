const _ = require('lodash')
const moment = require('moment')
const locations = require('./../data/locations.json')
const weekends = require('./../utils/weekends')(moment(), moment().add(1, 'weeks'))
const getTemplate = require('./../utils/get-template')

const getDropdown = locations => _
  .chain(locations)
  .keys()
  .map(location => ({
    city: locations[location].city,
    href: `/from/${locations[location].city.split(' ').join('-').toLowerCase()}/`,
  }))
  .orderBy(['city'], ['asc'])
  .value()

const getTitle = (needle, subdomain, results) => {
  const tpl = props => `${props.insert}`

  let title = subdomain
    ? tpl({ insert: `Find ${subdomain.title} Donuts` })
    : tpl({ insert: 'Find Donuts' })

  if (needle) {
    title += ` from ${locations[needle].city}`
  }

  if (results && results.length) {
    title += ` from as little as $${results[0].price}`
  }

  return title
}

const tpl = include => props => new Promise((resolve, reject) => {
  getTemplate(
    props,
    include,
    html => resolve(html),
    error => reject(error)
  )
})

const getTemplateMiddleware = (req, res, next) => {
  const locationsWithPrices = {}

  let sortedResults

  if (res.locals.results) {
    sortedResults = res.locals.results
      .slice(0)
      .sort((a, b) => a.price - b.price)
  }

  for (let key in locations) {
    locationsWithPrices[key] = locations[key]

    if (sortedResults) {
      var found = sortedResults
        .find(result => result.to === key)

      locationsWithPrices[key].price = found ? found.price : undefined
    }
  }

  const title = getTitle(res.locals.needle, res.locals.subdomain, sortedResults)

  const dropdown = getDropdown(locations)

  const props = {
    title, 
    from: res.locals.needle,
    city: locations[res.locals.needle] && locations[res.locals.needle].city,
    locations: locationsWithPrices
  }

  const head = tpl('head')({
    title,
    from: res.locals.needle
  })

  const header = tpl('header')({
    dropdown,
    city: locations[res.locals.needle] && locations[res.locals.needle].city,
  })

  const jumbotron = tpl('jumbotron')({
    from: res.locals.needle,
    title,
    weekend: weekends[0],
    city: locations[res.locals.needle] && locations[res.locals.needle].city,
  })

  const cards = tpl('cards')({
    from: res.locals.needle,
    results: res.locals.results || [],
    filters: res.locals.filters,
    sort: res.locals.sort
  })

  const destinations = tpl('destinations')({
    from: res.locals.needle,
    weekend: weekends[0],
    locations
  })

  const map = tpl('map')(props)

  const footer = tpl('footer')({
    links: res.locals.links
  })

  const foot = tpl('foot')({
    from: res.locals.needle
  })

  Promise.all([
    head,
    header,
    jumbotron,
    cards,
    destinations,
    map,
    footer,
    foot
  ])
    .then(response => {
      getTemplate(
        Object.assign({},
          props,
          {
            head: response[0],
            header: response[1],
            jumbotron: response[2],
            cards: response[3],
            destinations: response[4],
            map: response[5],
            footer: response[6],
            foot: response[7]
          }
        ),
        'index',
        html => {
          res.locals.html = html

          next()
        },
        error => next(error)
      )
    })
    .catch(error => next(error))
}

module.exports = getTemplateMiddleware
