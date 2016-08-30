// let genericRoutes = require('../generic_routes')
let ObjectId = require('mongodb').ObjectId
// let collectionSingular = 'account_category'
let collectionPlural = 'accounts_categories'

exports.defineRoutes = function (server, mongoDb) {
  // genericRoutes.get(server, mongoDb, collectionPlural)
  // genericRoutes.getOne(server, mongoDb, collectionSingular, collectionPlural)

  // Override genericRoutes because of special integrity constraint checking
  // genericRoutes.post(server, mongoDb, collectionPlural)
  server.post('/' + collectionPlural, (req, res, next) => {
    if (!req.body.account_id) {
      res.json({error: 'An account_category must have an account_id'})
      return
    }

    if (!req.body.category_id) {
      res.json({error: 'An account_category must have a category_id'})
      return
    }

    req.body.account_id = ObjectId(req.body.account_id)
    req.body.category_id = ObjectId(req.body.category_id)

    Promise.all([
      new Promise((resolve, reject) => {
        mongoDb.collection('accounts').findOne({'_id': req.body.account_id}).then(result => {
          if (result === null) reject('Account ' + req.body.account_id.toString() + ' does not exist')
          resolve(result)
        })
      }),
      new Promise((resolve, reject) => {
        mongoDb.collection('categories').findOne({'_id': req.body.category_id}).then(result => {
          if (result === null) reject('Category ' + req.body.category_id.toString() + ' does not exist')
          resolve(result)
        })
      })
    ])
    .then((result) => {
      // insertOne only returns the new _id.  We want to return the complete
      // new document, which is what we originally requested to store
      // with the new _id added to this.
      let retVal = req.body
      mongoDb.collection(collectionPlural).insertOne(req.body).then(result => {
        retVal._id = result.insertedId.toString()
        res.json(retVal)
      })
    })
    .catch(error => {
      res.json({error: error})
    })
  })

  // Override genericRoutes because of special integrity constraint checking
  // genericRoutes.put(server, mongoDb, collectionSingular, collectionPlural)
  server.put('/' + collectionPlural + '/:account_category_id', (req, res, next) => {
    if (req.body.account_id) req.body.account_id = ObjectId(req.body.account_id)
    if (req.body.category_id) req.body.category_id = ObjectId(req.body.category_id)

    Promise.all([
      new Promise((resolve, reject) => {
        if (!req.body.account_id) resolve(true)
        mongoDb.collection('accounts').findOne({'_id': req.body.account_id}).then(result => {
          if (result === null) reject('Account ' + req.body.account_id.toString() + ' does not exist')
          resolve(result)
        })
      }),
      new Promise((resolve, reject) => {
        if (!req.body.category_id) resolve(true)
        mongoDb.collection('categories').findOne({'_id': req.body.category_id}).then(result => {
          if (result === null) reject('Category ' + req.body.category_id.toString() + ' does not exist')
          resolve(result)
        })
      })
    ])
    .then((result) => {
      mongoDb.collection(collectionPlural).findOneAndUpdate(
          {'_id': ObjectId(req.params.account_category_id)},
          req.body,
          {returnOriginal: false}
      )
      .then(function resolve (result) {
        if (result.value === null) result.value = {error: 'account_category ' + req.params.id + ' does not exist'}
        res.json(result.value)
      })
    })
    .catch(error => {
      res.json({error: error})
    })
  })

  // genericRoutes.delete(server, mongoDb, collectionSingular, collectionPlural)
}
