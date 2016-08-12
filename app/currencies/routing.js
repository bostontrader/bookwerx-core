let genericRoutes = require('../generic_routes')
let collectionSingular = 'currency'
let collectionPlural = 'currencies'

exports.defineRoutes = function (server, mongoDb) {
  genericRoutes.get(server, mongoDb, collectionPlural)
  genericRoutes.getOne(server, mongoDb, collectionSingular, collectionPlural)
  genericRoutes.post(server, mongoDb, collectionPlural)
  genericRoutes.put(server, mongoDb, collectionSingular, collectionPlural)
  genericRoutes.delete(server, mongoDb, collectionSingular, collectionPlural)
}
