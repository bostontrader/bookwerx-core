var test = require('tape')
var account = require('./account-model')

test('account.findAll should return an array', function (assert) {
    account.findAll(function (error, result) {
        assert.error(error)
        assert.ok(Array.isArray(result))
        assert.end()
    })
})