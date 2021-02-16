const getPhenixFeed = require('../feeds/phenix')
const { LotType } = require('../enum')
const logger = require('../logger')

function getFeed(type, cronTime) {
  switch (type) {
    case LotType.PK10LA:
    case LotType.PK10BJ:
    case LotType.LHHK:
    case LotType.K3L3:
    case LotType.D3W:
      return getPhenixFeed(type, cronTime)
  }
  throw new Error(`Unsupported lottery type '${type}'`)
}

function postFeed(error, opt) {
  if (error) logger.error(`[${opt.lotType}] ${error.message}`)
  else logger.info(`[${opt.lotType}] success`)
}

module.exports = { getFeed, postFeed }
