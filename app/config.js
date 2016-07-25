var config = module.exports
var PRODUCTION = process.env.NODE_ENV === 'production'

config.express = {
  port: process.env.EXPRESS_PORT || 3003,
  //ip: '127.0.0.1'
  ip: '0.0.0.0'
}

config.mongodb = {
  port: process.env.MONGODB_PORT     || 27017,
  host: process.env.MONGODB_HOST     || 'localhost',
  dbname: process.env.MONGODB_DBNAME || 'bookwerx-core'
}
if (PRODUCTION) {
  // for example
  config.express.ip = '0.0.0.0'
}
// config.db same deal
// config.email etc
// config.log