const http = require('http')
const runScraper = require('@0y0/scraper')
const env = require('../env')
const logger = require('../logger')
const { getFeed, postFeed } = require('./feedService')

function scrapeAsync(type) {
  return new Promise((resolve, reject) => {
    try {
      runScraper(getFeed(type), (error, opt) => {
        postFeed(error, opt)
        resolve()
      })
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

async function handleScrapeApi(req, res) {
  const body = await readJsonRequest(req)
  if (body == null) throw new Error('Body is null')
  if (!Array.isArray(body.types)) throw new Error('Body.types is not an array')
  if (!body.types.length) throw new Error('Body.types is empty')
  await Promise.all(body.types.map(scrapeAsync))
  return writeResponse(res, 200)
}

async function handleApi(req, res) {
  const endpoint = `${req.method}:${req.url}`
  switch (endpoint) {
    case 'GET:/':
      return writeResponse(res, 200)
    case 'POST:/scrape': {
      try {
        return await handleScrapeApi(req, res)
      } catch (error) {
        logger.error(`[${endpoint}] ${error.message}`)
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
