const debug = require('debug')

module.exports = {
  info: debug('app:info'),
  error: debug('app:error')
}
