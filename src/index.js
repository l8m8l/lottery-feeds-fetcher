process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
process.env.DEBUG = process.env.DEBUG || 'app:*'

require('@0y0/scraper-extensions')
require('dotenv').config()
require('./services/apiServer').run()
