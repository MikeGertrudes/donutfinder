const logger = require('./../utils/logger')(process.env.DEBUG)

const errorHandlerMiddleware = (err, req, res, next) => {
  logger.error(err)

  res.redirect('/')
}

module.exports = errorHandlerMiddleware
