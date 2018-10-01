const locations = require('./../data/locations.json')

const toTitleCase = string => {
  string = string.toLowerCase().split(' ')

  for (let i = 0; i < string.length; i++) {
    string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1)
  }

  return string.join(' ')
}

const getNeedle = (locations, needle) => {
  let localNeedle = needle

  if (!needle) throw new Error(`NEEDLE MISSING.`)

  if (needle.length > 3) {
    const cleanedUpNeedle = toTitleCase(needle.split('-').join(' '))

    localNeedle = Object.keys(locations).find(location => locations[location].city === cleanedUpNeedle)

  } else {
    localNeedle = needle.toUpperCase()
  }

  if (!localNeedle || !locations[localNeedle]) throw new Error(`O&D: "${needle}" NOT SUPPORTED. REDIRECTING TO HOMEPAGE.`)

  return localNeedle
}

const getNeedleMiddleware = (req, res, next) => {
  try {
    res.locals.needle = getNeedle(locations, req.params.location)
  } catch (error) {
    return next(error)
  }

  next()
}

module.exports = getNeedleMiddleware
