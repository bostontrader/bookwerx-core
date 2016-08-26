let genericRoutes = require('../generic_routes')
let ObjectId = require('mongodb').ObjectId
let collectionSingular = 'transaction'
let collectionPlural = 'transactions'

exports.defineRoutes = function (server, mongoDb) {
  genericRoutes.get(server, mongoDb, collectionPlural)
  genericRoutes.getOne(server, mongoDb, collectionSingular, collectionPlural)
  genericRoutes.post(server, mongoDb, collectionPlural)
  genericRoutes.put(server, mongoDb, collectionSingular, collectionPlural)
  genericRoutes.delete(server, mongoDb, collectionSingular, collectionPlural)

  /*
   The transaction dashboard contains a list of all distributions for a particular transaction,
   listed in no particular order, as well as other various joined fields such as a currency symbol.
   In addition, we also want info from the transaction document itself.

   More particularly, we want:

   {
     "transaction":{
        "_id": ...,
        "datetime": ...,
        "note": ...
      },
      "distributions": {[
        "_id": ...,
        "account_id":"123",
        "currency_id":"456",
        "amount":500,
        "transaction_id":"nnn",
        "account":[
          {"_id":"123","title":"Cash in Mattress"}
        ],
        "currency":[
          {"_id":"456","symbol":"RMB","title":"Ren Min Bi"}
        ]
      ]}
   }

   We produce this with two queries to the db.  One to get the transaction info, and one to get the distribution (and
   joined) info.

   Even though account and currency are arrays (cuz that's how mongo rolls), in this app, there should only
   be exactly one of each.

   */
  server.get('/transactions/dashboard/:transaction_id', (req, res, next) => {
    let distributions
    return mongoDb.collection('distributions')
      .aggregate([
        {$match: {transaction_id: ObjectId(req.params.transaction_id)}},
        {
          $lookup: {
            from: 'accounts',
            localField: 'account_id',
            foreignField: '_id',
            as: 'account'
          }
        },
        {
          $lookup: {
            from: 'currencies',
            localField: 'currency_id',
            foreignField: '_id',
            as: 'currency'
          }
        }
      ]).toArray()
    .then(result => {
      distributions = result
      return mongoDb.collection('transactions').findOne({'_id': ObjectId(req.params.transaction_id)})
    })
    .then(result => {
      res.json({'distributions': distributions, 'transaction': result})
    }).catch(error => {
      res.json({'error': error})
    })
  })
}
