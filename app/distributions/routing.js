let genericRoutes = require('../generic_routes')
let collectionSingular = 'distribution'
let collectionPlural = 'distributions'

exports.defineRoutes = function (server, mongoDb) {
  genericRoutes.get(server, mongoDb, collectionPlural)
  genericRoutes.getOne(server, mongoDb, collectionSingular, collectionPlural)

  // Override genericRoutes because of special integrity constraint checking
  // genericRoutes.post(server, mongoDb, collectionPlural)
  server.post('/' + collectionPlural, (req, res, next) => {
    // insertOne only returns the new _id.  We want to return complete
    // new document, which is what we originally requested to store
    // with the new _id added to this.
    let retVal = req.body

    if (!req.body.account_id) {
      res.json({error: 'A distribution must have an account_id'})
    }

    if (!req.body.currency_id) {
      res.json({error: 'A distribution must have a currency_id'})
    }

    if (!req.body.transaction_id) {
      res.json({error: 'A distribution must have a transaction_id'})
    }

    mongoDb.collection(collectionPlural).insertOne(req.body).then(result => {
      retVal._id = result.insertedId.toString()
      res.json(retVal)
    }).catch(error => {
      res.json({error: error})
    })
  })

  genericRoutes.put(server, mongoDb, collectionSingular, collectionPlural)
  genericRoutes.delete(server, mongoDb, collectionSingular, collectionPlural)
}
