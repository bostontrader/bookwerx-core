var express = require('express')
var app = express()

app.set('views', __dirname)
// use whatever templating system(s) you like
app.set('view engine', 'jade')

// The ordering of routing and middleware is important
app.use(require('app/site/router'))
app.use('/api', require('app/accounts/router'))

// FINALLY, use any error handlers
app.use(require('app/errors/not-found'))

// Export the app instance for unit testing via supertest
module.exports = app