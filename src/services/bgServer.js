const runScraper = require('@0y0/scraper')
const { LotType } = require('../enum')
const env = require('../env')
const { getFeed, postFeed } = require('./feedService')

const LotCronTime = {
  [LotType.PK10LA]: env.pk10laCron,
  [LotType.PK10BJ]: env.pk10bjCron,
  [LotType.LHHK]: env.lhhkCron,
  [LotType.K3L3]: env.k3l3Cron,
  [LotType.D3W]: env.d3wCron
}

function getCronFeed(type) {
  const cronTime = LotCronTime[type]
  if (!cronTime) throw new Error(`The cron time of '${type}' is not defined`)
  return getFeed(type, cronTime)
}

function run() {
  const feeds = [
    getCronFeed(LotType.PK10LA),
    getCronFeed(LotType.PK10BJ),
    getCronFeed(LotType.LHHK),
    getCronFeed(LotType.K3L3),
    getCronFeed(LotType.D3W)
  ]
  runScraper(feeds, postFeed)
}

module.exports = { run }
