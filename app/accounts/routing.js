let genericRoutes = require('../generic_routes')

let ObjectId = require('mongodb').ObjectId
let collectionSingular = 'account'
let collectionPlural = 'accounts'

exports.defineRoutes = function (server, mongoDb) {
  genericRoutes.get(server, mongoDb, collectionSingular, collectionPlural)

  server.get('/' + collectionPlural + '/:id', (req, res, next) => {
    mongoDb.collection(collectionPlural).findOne({'_id': ObjectId(req.params.id)}).then(result => {
      if (result === null) result = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
      res.json(result)
      next()
    }).catch(error => {
      res.json({error: error})
    })
  })

  server.post('/' + collectionPlural, (req, res, next) => {
    // insertOne only returns the new _id.  We want to return complete
    // new document, which is what we originally requested to store
    // with the new _id added to this.
    let retVal = req.body
    mongoDb.collection(collectionPlural).insertOne(req.body).then(result => {
      retVal._id = result.insertedId.toString()
      res.json(retVal)
    }).catch(error => {
      res.json({error: error})
    })
  })

  server.put('/' + collectionPlural + '/:id', (req, res, next) => {
    mongoDb.collection(collectionPlural).findOneAndUpdate(
        {'_id': ObjectId(req.params.id)},
        {title: req.body.title},
        {returnOriginal: false}).then(function resolve (result) {
          if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
          res.json(result.value)
        }).catch(error => {
          res.json({'error': error})
        })
  })

  server.del('/' + collectionPlural + '/:id', (req, res, next) => {
    mongoDb.collection(collectionPlural).findOneAndDelete({'_id': ObjectId(req.params.id)}).then(function resolve (result) {
      if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
      res.json(result.value)
    }).catch(error => {
      res.json({'error': error})
    })
  })
}
