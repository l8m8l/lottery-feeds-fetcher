require('dotenv').config()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
process.env.DEBUG = process.env.DEBUG || 'app:*'

module.exports = {
  phenixUrl: process.env.PHENIX_URL,
  gscriptUrl: process.env.GSCRIPT_URL,
  pk10laCron: process.env.PK10LA_CRON,
  pk10bjCron: process.env.PK10BJ_CRON,
  lhhkCron: process.env.LHHK_CRON,
  k3l3Cron: process.env.K3L3_CRON,
  d3wCron: process.env.D3W_CRON
}
