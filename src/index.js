const runScraper = require('@0y0/scraper')
require('@0y0/scraper-extensions')
const getPhenixFeed = require('./feeds/phenix')
const { LotType } = require('./enum')
require('./env')
const healthCheck = require('./healthCheck')
const logger = require('./logger')

healthCheck()
runScraper(
  [
    getPhenixFeed(LotType.PK10LA),
    getPhenixFeed(LotType.PK10BJ),
    getPhenixFeed(LotType.LHHK),
    getPhenixFeed(LotType.K3L3),
    getPhenixFeed(LotType.D3W)
  ],
  (error, opt) => {
    if (error) logger.error(`[${opt.lotType}] ${error.message}`)
    else logger.info(`[${opt.lotType}] success`)
  }
)
