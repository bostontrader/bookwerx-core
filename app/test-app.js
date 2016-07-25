// Express, Jade, routes... stuff we need.  Factor this out because the main
// and the test app both need this.
var app = require('./bootstrap')

var request = require('supertest')
module.exports = request(app)