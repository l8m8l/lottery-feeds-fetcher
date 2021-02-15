const http = require('http')

module.exports = () => {
  http
    .createServer((req, res) => {
      res.statusCode = 200
      res.end()
    })
    .listen(process.env.PORT ?? 80)
}
