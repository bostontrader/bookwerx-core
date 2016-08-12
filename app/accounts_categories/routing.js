let genericRoutes = require('../generic_routes')
let collectionSingular = 'account_category'
let collectionPlural = 'accounts_categories'

exports.defineRoutes = function (server, mongoDb) {
  genericRoutes.get(server, mongoDb, collectionPlural)
  genericRoutes.getOne(server, mongoDb, collectionSingular, collectionPlural)
  genericRoutes.post(server, mongoDb, collectionPlural)
  genericRoutes.put(server, mongoDb, collectionSingular, collectionPlural)
  genericRoutes.delete(server, mongoDb, collectionSingular, collectionPlural)
}
