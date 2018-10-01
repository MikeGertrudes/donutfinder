const fs = require('fs')
const equal = require('fast-deep-equal')
const logger = require('./logger')(!!process.env.DEBUG)

// TODO: this helps a navigating customer
//  and someone coming to the same page as them right after
//  but it really represents "last known state"
//  but really we want to cache this for each url and diff the props
//  cache = { 'head': { url: '', props: {}, html: '' } } OR
//  cache = { '/from/nyc/': { 'head': { props: {}, html: '' }, 'foot': { props: {}, html: '' }}}
//  because otherwise, page to page only the footer is _really_ cached
//  you really want to measure the percentage of cache hits
//  it really can never be stale since it's driven by a prop diff
const cache = {
  data: {
    // 'head': {
    //   props: {},
    //   html: '<head></head>'
    // },
    // '/from/nyc/': {
    //   'head': {
    //     props: {},
    //     html: '<head></head>'
    //   }
    // }
  },
  get: function get(include, props) {
    const cached = this.data[include]

    if (cached && equal(cached.props, props)) return cached.html

    return null
  },
  set: function set(include, props, html) {
    this.data[include] = {
      props,
      html
    }
  }
}

const template = tpl => new Function('props', 'return `' + tpl + '`')

const getTemplate = (props, include, callback, errback) => {
  if (!!process.env.USE_TEMPLATE_CACHE) {
    const html = cache.get(include, props)

    if (html) {
      logger.info(`PULLING ${include} FROM CACHE.`)

      return callback(html)
    }
  }

  fs.readFile(`./src/templates/${include}.html`, (error, tpl) => {
    if (error) return errback(error)

    const html = template(tpl)(props)

    if (!!process.env.USE_TEMPLATE_CACHE) {
      logger.info(`STORING ${include} IN CACHE.`)

      cache.set(include, props, html)
    }

    return callback(html)
  })
}

module.exports = getTemplate
