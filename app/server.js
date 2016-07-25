#!/usr/bin/env node

// Express, Jade, routes, db... stuff we need.  Factor this out because
// test-app uses it also.
var app    = require('./index')

var config = require('./config')

var db     = require('./db')

// Setup logging.
var bole = require('bole')
bole.output({level: 'debug', stream: process.stdout})
var log = bole('server')

log.info('server process starting')

// Connect to Mongo on start.  If successful, then start listening
db.connect('mongodb://localhost:27017/bookwerx-core', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(config.express.port, config.express.ip, function (error) {
      if (error) {
        log.error('Unable to listen for connections', error)
        process.exit(10)
      }
      log.info('express is listening on http://' +
          config.express.ip + ':' + config.express.port)
    })
  }
})
