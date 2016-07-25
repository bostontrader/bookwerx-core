var express = require('express')
var join = require('path').join

var router = new express.Router()

function home (req, res) {
  res.render('site/home')
}

function about (req, res) {
  res.render('site/about')
}

router.use(express.static(join(__dirname, '../../wwwroot')))
router.get('/', home)
router.get('/about', about)

module.exports = router
