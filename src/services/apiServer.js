const http = require('http')
const runScraper = require('@0y0/scraper')
const env = require('../env')
const logger = require('../logger')
const { getFeed } = require('./feedService')

function scrapeAsync(type) {
  return new Promise((resolve, reject) => {
    try {
      runScraper(getFeed(type), error => (error ? reject(error) : resolve()))
    } catch (error) {
      reject(error)
    }
  })
}

function readJsonRequest(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
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

async function handleApi(req, res) {
  const endpoint = `${req.method}:${req.url}`
  switch (endpoint) {
    case 'GET:/':
      return writeResponse(res, 200)
    case 'POST:/scrape': {
      let type = 'Unknown'
      try {
        type = (await readJsonRequest(req)).type
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
}

function run() {
  const port = env.port ?? 80
  http
    .createServer(handleApi)
    .listen(port, () => logger.info(`Server started at ${port}`))
}

module.exports = { run }
