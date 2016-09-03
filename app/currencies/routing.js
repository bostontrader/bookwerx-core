let genericRoutes = require('../generic_routes')
let ObjectId = require('mongodb').ObjectId
let collectionSingular = 'currency'
let collectionPlural = 'currencies'

exports.defineRoutes = function (server, mongoDb) {
  genericRoutes.get(server, mongoDb, collectionPlural)
  genericRoutes.getOne(server, mongoDb, collectionSingular, collectionPlural)
  genericRoutes.post(server, mongoDb, collectionPlural)
  genericRoutes.put(server, mongoDb, collectionSingular, collectionPlural)

  // genericRoutes.delete(server, mongoDb, collectionSingular, collectionPlural)
  // This differs from genericRoutes in that it must not delete if other
  // foreign keys refer to it.  Presently, only distributions.
  // Note: DELETE does not have a body, so find the currency_id in req.params
  server.del('/' + collectionPlural + '/:currency_id', (req, res, next) => {
    new Promise((resolve, reject) => {
      let currencyId = ObjectId(req.params.currency_id)
      mongoDb.collection('distributions').findOne({'currency_id': currencyId}).then(result => {
        if (result === null) {
          resolve(true)
        } else {
          let msg = 'Cannot delete this currency because distributions ' + result._id.toString() + ' refers to it'
          reject(msg)
        }
      })
    })
    .then((result) => {
      mongoDb.collection(collectionPlural).findOneAndDelete({'_id': ObjectId(req.params.currency_id)})
      .then(function resolve (result) {
        if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.currency_id + ' does not exist'}
        res.json(result.value)
      })
    })
    .catch(error => {
      res.json({error: error})
    })
  })
}
