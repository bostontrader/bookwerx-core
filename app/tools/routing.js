let ObjectId = require('mongodb').ObjectId

exports.defineRoutes = function (server, mongoDb) {
  server.put('/brainwipe', (req, res, next) => {
    mongoDb.dropDatabase().then(function resolve (result) {
      res.json(result)
    }).catch(error => {
      res.json({'error': error})
    })
  })

  /* What's a better name for this?
  We frequently want a list of all distributions for a particular account,
  listed in transaction_datetime order.
  */

  server.get('/catfood1/:account_id', (req, res, next) => {
    mongoDb.collection('distributions')
      .aggregate([
        {$match: {account_id: ObjectId(req.params.account_id)}},
        {$lookup: {
          from: 'transactions',
          localField: 'transaction_id',
          foreignField: '_id',
          as: 'transaction_info'
        }},
        {$sort: {'transaction_info.datetime': 1}}
      ]).toArray()
    .then(result => {
      res.json(result)
    }).catch(error => {
      res.json({'error': error})
    })
  })
}
