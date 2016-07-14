var account = require('./account-model')
var log = require('bole')('accounts/router')
var router = require('express').Router()

function getCustomers (req, res) {
    account.findAll(function (error, accounts) {
        if (error) {
            log.error(error, 'error finding accounts')
            res.status(500).send(error)
            return
        }
        res.json(accounts)
    })
}

function createCustomer (req, res) {
    res.status(201).send()
}

router.post('/accounts', createCustomer)
router.get('/accounts', getCustomers)

module.exports = router