const request = require('request')
const moment = require('moment')
const locations = require('./../data/locations')

const WEATHER_TIMEOUT = process.env.WEATHER_TIMEOUT || 0

const icons = {
  'clear-day': `🌞️`,
  'clear-night': '🌑',
  'rain': '🌧',
  'snow': '❄️',
  'sleet': '🌨',
  'wind': '💨',
  'fog': '☁️',
  'cloudy': '☁️',
  'partly-cloudy-day': '🌤',
  'partly-cloudy-night': '🌗'
}

const query = ({ lat, lng }) => `https://api.donutfinder.com/weather/${lat},${lng}`

const getWeather = (location, callback, errback) => {
  const url = query(locations[location])

// TODO, abandon ship but don't throw error
// hmmm, timeout of 1000 works, but 200 is too short
  request(url, { timeout: WEATHER_TIMEOUT }, (error, response, body) => {
    if (error) return errback(error)

    if (response && response.statusCode == 200) callback(icons[JSON.parse(body).daily.icon])
    else errback(new Error)
  })
}

module.exports = getWeather
