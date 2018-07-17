const genericRoutes = require('../genericRoutes')

// let ObjectId = require('mongodb').ObjectId
const collectionSingular = 'category'
const collectionPlural = 'categories'

module.exports = (server, mongoDb) => {
  genericRoutes.get(server, mongoDb, collectionPlural)
  genericRoutes.getOne(server, mongoDb, collectionSingular, collectionPlural)
  genericRoutes.patch(server, mongoDb, collectionSingular, collectionPlural)
  genericRoutes.post(server, mongoDb, collectionPlural)

  // This differs from genericRoutes in that it must not delete if other
  // foreign keys refer to it.  Presently, only accounts_categories.
  // Note: DELETE does not have a body, so find the account_id in req.params
  genericRoutes.delete(server, mongoDb, collectionSingular, collectionPlural)
// server.del('/' + collectionPlural + '/:category_id', (req, res, next) => {

// const coreQuery = () => {
// new Promise((resolve, reject) => {
// const categoryId = ObjectId(req.params.category_id)
// mongoDb.collection('accounts_categories').findOne({'category_id': categoryId})
// .then(result => {
// if (result === null) {
// resolve(true)
// } else {
// let msg = 'Cannot delete this category because accounts_categories ' + result._id.toString() + ' refers to it'
// reject(msg)
// }
// })
// })
// .then((result) => {
// return mongoDb.collection(collectionPlural).findOneAndDelete({'_id': categoryId})
// .then(function resolve (result) {
// if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.category_id + ' does not exist'}
// res.json(result.value)
// })
// })
// .catch(error => {
// res.json({error: error})
// })
// }
// authThenInvoke(req, res, coreQuery)
// })
// }
}
