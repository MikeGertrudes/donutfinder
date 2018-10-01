const express = require('express')
const moment = require('moment')
const compression = require('compression')
const logger = require('./src/utils/logger')(process.env.DEBUG || false)

const getNeedleMiddleware = require('./src/middleware/getNeedleMiddleware')
const getSubdomainMiddleware = require('./src/middleware/getSubdomainMiddleware')
const filterAndSortMiddleware = require('./src/middleware/filterAndSortMiddleware')
const getResultsMiddleware = require('./src/middleware/getResultsMiddleware')
const getLinksMiddleware = require('./src/middleware/getLinksMiddleware')
const getTemplateMiddleware = require('./src/middleware/getTemplateMiddleware')
const renderMiddleware = require('./src/middleware/renderMiddleware')
const errorHandlerMiddleware = require('./src/middleware/errorHandlerMiddleware')

const imageErrorHandlerMiddleware = (req, res, next) => {
  if (req.url.includes('.png')) res.redirect(302, '/img/donut.png')

  next()
}

const app = express()

app
  .set('port', (process.env.PORT || 8080))
  .set('host', (process.env.HOST || '0.0.0.0'))
  .use(express.static('public', { fallthrough: true }),
    imageErrorHandlerMiddleware
  )
  .use(compression())
  .get('/from/:location',
    getSubdomainMiddleware,
    getNeedleMiddleware,
    filterAndSortMiddleware,
    getResultsMiddleware,
    getLinksMiddleware,
    getTemplateMiddleware,
    renderMiddleware
  )
  .get('/',
    getSubdomainMiddleware,
    getLinksMiddleware,
    getTemplateMiddleware,
    renderMiddleware
  )
  .use(errorHandlerMiddleware)

module.exports = app.listen(
  app.get('port'),
  app.get('host'),
  () => logger.info(`🍩🔎 RUNNING AT http://${app.get('host')}:${app.get('port')}.`)
)
