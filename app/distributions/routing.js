// let genericRoutes = require('../generic_routes')
let ObjectId = require('mongodb').ObjectId
// let collectionSingular = 'distribution'
let collectionPlural = 'distributions'

exports.defineRoutes = function (server, mongoDb) {
  // genericRoutes.get(server, mongoDb, collectionPlural)
  // genericRoutes.getOne(server, mongoDb, collectionSingular, collectionPlural)

  // Override genericRoutes because of special integrity constraint checking
  // genericRoutes.post(server, mongoDb, collectionPlural)
  server.post('/' + collectionPlural, (req, res, next) => {
    if (!req.body.account_id) {
      res.json({error: 'A distribution must have an account_id'})
      return
    }

    if (!req.body.currency_id) {
      res.json({error: 'A distribution must have a currency_id'})
      return
    }

    if (!req.body.transaction_id) {
      res.json({error: 'A distribution must have a transaction_id'})
      return
    }

    req.body.account_id = ObjectId(req.body.account_id)
    req.body.currency_id = ObjectId(req.body.currency_id)
    req.body.transaction_id = ObjectId(req.body.transaction_id)

    Promise.all([
      new Promise((resolve, reject) => {
        mongoDb.collection('accounts').findOne({'_id': req.body.account_id}).then(result => {
          if (result === null) reject('Account ' + req.body.account_id.toString() + ' does not exist')
          resolve(result)
        })
      }),
      new Promise((resolve, reject) => {
        mongoDb.collection('currencies').findOne({'_id': req.body.currency_id}).then(result => {
          if (result === null) reject('Currency ' + req.body.currency_id.toString() + ' does not exist')
          resolve(result)
        })
      }),
      new Promise((resolve, reject) => {
        mongoDb.collection('transactions').findOne({'_id': req.body.transaction_id}).then(result => {
          if (result === null) reject('Transaction ' + req.body.transaction_id.toString() + ' does not exist')
          resolve(result)
        })
      })
    ])
    .then((result) => {
        // insertOne only returns the new _id.  We want to return the complete
        // new document, which is what we originally requested to store
        // with the new _id added to this.
        // let retVal = req.body
        // .then((result) => {
        // mongoDb.collection(collectionPlural).insertOne(req.body).then(result => {
          // retVal._id = result.insertedId.toString()
          // res.json(retVal)
          // })
        // })
    })
    .catch(error => {
      res.json({error: error})
    })
  })

  // Override genericRoutes because of special integrity constraint checking
  // genericRoutes.put(server, mongoDb, collectionSingular, collectionPlural)
  /* server.put('/' + collectionPlural + '/:id', (req, res, next) => {
    req.body.account_id = ObjectId(req.body.account_id)
    req.body.currency_id = ObjectId(req.body.currency_id)
    req.body.transaction_id = ObjectId(req.body.transaction_id)
    mongoDb.collection(collectionPlural).findOneAndUpdate(
      {'_id': ObjectId(req.params.id)},
      req.body,
      {returnOriginal: false}
    )
    .then(function resolve (result) {
      if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
      res.json(result.value)
    }).catch(error => {
      res.json({'error': error})
    })
  })*/

  // genericRoutes.delete(server, mongoDb, collectionSingular, collectionPlural)
}
