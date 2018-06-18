const genericRoutes = require('../genericRoutes')

// let ObjectId = require('mongodb').ObjectId
const collectionSingular = 'currency'
const collectionPlural = 'currencies'

module.exports = (server, mongoDb) => {
  genericRoutes.get(server, mongoDb, collectionPlural)
  // server.get('/' + collectionPlural, (req, res, next) => {
  // if (req.query.sort) sort = JSON.parse(req.query.sort)
  // mongoDb.collection(collectionPlural).find().sort(sort).toArray().then(result => {
  // res.json(result)
  // next()
  // }).catch(error => {
  // res.json({error: error})
  // })
  // })
  // },

  genericRoutes.getOne(server, mongoDb, collectionSingular, collectionPlural)
  genericRoutes.patch(server, mongoDb, collectionSingular, collectionPlural)
  genericRoutes.post(server, mongoDb, collectionPlural)
  // genericRoutes.put(server, mongoDb, collectionSingular, collectionPlural)

  // This differs from genericRoutes in that it must not delete if other
  // foreign keys refer to it.  Presently, only distributions.
  // Note: DELETE does not have a body, so find the currency_id in req.params
  genericRoutes.delete(server, mongoDb, collectionSingular, collectionPlural)
  // server.del('/' + collectionPlural + '/:currency_id', (req, res, next) => {
  // const coreQuery = () => {
  // new Promise((resolve, reject) => {
  // const currencyId = ObjectId(req.params.currency_id)
  // mongoDb.collection('distributions').findOne({'currency_id': currencyId}).then(result => {
  // if (result === null) {
  // resolve(true)
  // } else {
  // const msg = 'Cannot delete this currency because distributions ' + result._id.toString() + ' refers to it'
  // reject(msg)
  // }
  // })
  // })
  // .then((result) => {
  // return mongoDb.collection(collectionPlural).findOneAndDelete({'_id': ObjectId(req.params.currency_id)})
  // .then(function resolve (result) {
  // if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.currency_id + ' does not exist'}
  // res.json(result.value)
  // })
  // })
  // .catch(error => {
  // res.json({error: error})
  // })
  // }
  // authThenInvoke(req, res, coreQuery)
  // })
}
