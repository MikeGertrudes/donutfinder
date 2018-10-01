const loggerCreator = debug => ({
  log: (...args) => debug ? (process.env.NODE_ENV !== 'production'
    ? console.log.apply(null, ['\x1b[32m%s\x1b[0m', args])
    : console.log.apply(null, args)) : undefined,
  info: (...args) => debug ? (process.env.NODE_ENV !== 'production'
    ? console.info.apply(null, ['\x1b[2m%s\x1b[0m', args])
    : console.info.apply(null, args)) : undefined,
  warn: (...args) => debug ? (process.env.NODE_ENV !== 'production'
    ? console.warn.apply(null, ['\x1b[33m%s\x1b[0m', args])
    : console.warn.apply(null, args)) : undefined,
  error: (...args) => debug ? (process.env.NODE_ENV !== 'production'
    ? console.error.apply(null, ['\x1b[31m%s\x1b[0m', args])
    : console.error.apply(null, args)) : undefined,
  time: label => debug ? console.time(label) : undefined,
  timeEnd: label => debug ? console.timeEnd(label) : undefined
})

module.exports = (debug = false) => loggerCreator(debug)
