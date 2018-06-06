// import cryptoRandomString from 'crypto-random-string'
const cryptoRandomString = require('crypto-random-string')

module.exports = (server, mongoDb) => {
  // Generate a new set of keys.
  server.post('/keys', (req, res, next) => {
    mongoDb.collection('keys').insertOne({key: cryptoRandomString(10), secret: cryptoRandomString(10)})
      .then(result => {
        if (result.result.n === 1 && result.result.ok === 1) {
          res.json(result.ops[0]) // there should only be one item in this array
          next()
        } else {
          res.json({error: result.result})
          next()
        }
      })
      .catch(error => {
        res.json({error: error})
        next()
      })
  })
}
