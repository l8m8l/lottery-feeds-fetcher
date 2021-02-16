const http = require('http')
const logger = require('./logger')

function parseRequestJsonBody(req) {
  return new Promise((resolve, reject) => {
    let chunks = []
    req
      .on('data', chunk => chunks.push(chunk))
      .on('error', reject)
      .on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString()))
        } catch (error) {
          reject(error)
        }
      })
  })
}

function writeResponse(res, statusCode) {
  res.statusCode = statusCode
  res.end()
}

module.exports = ({ scrapeAsync }) => {
  http
    .createServer(async (req, res) => {
      const endpoint = `${req.method}:${req.url}`
      switch (endpoint) {
        case 'GET:/':
          return writeResponse(res, 200)
        case 'POST:/scrape': {
          let type = 'Unknown'
          try {
            type = (await parseRequestJsonBody(req)).type
            await scrapeAsync(type)
            logger.info(`[${endpoint}:${type}] success`)
            return writeResponse(res, 200)
          } catch (error) {
            logger.error(`[${endpoint}:${type}] ${error.message}`)
            return writeResponse(res, 400)
          }
        }
        default:
          return writeResponse(res, 404)
      }
    })
    .listen(process.env.PORT ?? 80)
}
