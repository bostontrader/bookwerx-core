var app = require('../test-app')
var test = require('tape')

test('GET /api/accounts should send JSON list', function (assert) {
    app.get('/api/accounts')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(assert.end)
})

test('POST /api/accounts should send 201', function (assert) {
    app.post('/api/accounts')
        .send({name: 'Barbara Doe'})
        .expect(201)
        .end(assert.end)
})