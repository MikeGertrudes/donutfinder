const locations = require('./../data/locations.json')

const getLocations = locations => {
  const airports = Object.keys(locations)
    .map(location => ({
      href: `/from/${location.toLowerCase()}/`,
      title: `🍩🔎 ${location}`
    }))

  const cities = Object.keys(locations)
    .map(location => ({
      href: `/from/${locations[location].city.split(' ').join('-').toLowerCase()}/`,
      title: `🍩🔎 ${locations[location].city}`
    }))

  return [...airports, ...cities]
}

const getLinksMiddleware = (req, res, next) => {
  const links = getLocations(locations)

  res.locals.links = links

  next()
}

module.exports= getLinksMiddleware
