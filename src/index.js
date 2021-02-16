const runScraper = require('@0y0/scraper')
require('@0y0/scraper-extensions')
const getPhenixFeed = require('./feeds/phenix')
const { LotType } = require('./enum')
require('./env')
const runServer = require('./server')
const logger = require('./logger')

function getFeed(type) {
  switch (type) {
    case LotType.PK10LA:
    case LotType.PK10BJ:
    case LotType.LHHK:
    case LotType.K3L3:
    case LotType.D3W:
      return getPhenixFeed(type)
  }
  throw new Error(`Unsupported lottery type '${type}'`)
}

function scrapeAsync(type) {
  return new Promise((resolve, reject) => {
    try {
      runScraper(getFeed(type), error => (error ? reject(error) : resolve()))
    } catch (error) {
      reject(error)
    }
  })
}

runServer({ scrapeAsync })

runScraper(
  [
    getFeed(LotType.PK10LA),
    getFeed(LotType.PK10BJ),
    getFeed(LotType.LHHK),
    getFeed(LotType.K3L3),
    getFeed(LotType.D3W)
  ],
  (error, opt) => {
    if (error) logger.error(`[${opt.lotType}] ${error.message}`)
    else logger.info(`[${opt.lotType}] success`)
  }
)
