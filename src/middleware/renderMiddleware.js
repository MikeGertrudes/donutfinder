const renderMiddleware = (req, res) => {
  res.setHeader('Content-Type', 'text/html')

  res.status(200).send(res.locals.html)
}

module.exports = renderMiddleware
