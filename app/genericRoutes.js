const bookWerxConstants = require('./constants')

module.exports = {

  delete: (server, mongoDb, collectionSingular, collectionPlural) => {
    server.del('/' + collectionPlural + '/:id', (req, res, next) => {
      const ObjectId = require('mongodb').ObjectId
      const p = mongoDb.collection(collectionPlural).findOneAndDelete({'_id': ObjectId(req.params.id)})
        .then(function resolve (result) {
          if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
          res.json(result.value)
          next()
        })
      p.catch(error => {
        res.json({'error': error})
        next()
      })
    })
  },

  get: (server, mongoDb, collectionPlural, sort = {}) => {
    server.get('/' + collectionPlural, (req, res, next) => {
      if (req.query.sort) sort = JSON.parse(req.query.sort)
      const p = mongoDb.collection(collectionPlural).find({apiKey: req.query.apiKey})/* .sort(sort) */.toArray()
        .then(result => {
          res.json(result)
          next()
        })
      p.catch(error => {
        res.json({error: error})
        next()
      })
    })
  },

  getOne: (server, mongoDb, collectionSingular, collectionPlural) => {
    server.get('/' + collectionPlural + '/:id', (req, res, next) => {
      let oid
      try {
        oid = require('mongodb').ObjectId(req.params.id)

        const p = mongoDb.collection(collectionPlural).findOne({'_id': oid})
          .then(result => {
            res.json((result === null) ? {errors: [{key: '1', value: collectionSingular + ' ' + req.params.id + ' does not exist'}]} : {data: result})
          })
        p.catch(error => {
          res.json({errors: [{key: '1', value: error}]})
        })
        next()
      } catch (error) {
        res.json({errors: [{key: '1', value: error.message}]})
        next()
      }
    })
  },

  // post will enable the creation of new documents but will not update or replace existing documents.  Custom _id is prohibited for new documents.
  post: function (server, mongoDb, collectionPlural) {
    server.post('/' + collectionPlural, (req, res, next) => {
      // req.body.apiKey = req.query.apiKey
      mongoDb.collection(collectionPlural).insertOne(req.body)
        .then(result => {
          res.json(result)
          next()
        }).catch(error => {
          res.json({error: error})
          next()
        })
    })
  },

  // patch will enable the update of individual fields
  patch: function (server, mongoDb, collectionSingular, collectionPlural) {
    server.patch('/' + collectionPlural + '/:id', (req, res, next) => {
      let oid
      try {
        oid = require('mongodb').ObjectId(req.params.id)

        const p = mongoDb.collection(collectionPlural).findOneAndUpdate(
          {'_id': oid}, req.body, {returnOriginal: false})
          .then(function resolve (result) {
            res.json((result.value === null) ? {error: bookWerxConstants.ATTEMPTED_IMPLICIT_CREATE} : result.value)
          })
        p.catch(error => {
          res.json({'error': error})
        })
        next()
      } catch (error) {
        res.json({error: error.message})
        next()
      }
    })
  }

  // put will enable the total replacement (not update) of existing documents
  /* put: function (server, mongoDb, collectionSingular, collectionPlural) {
    server.put('/' + collectionPlural + '/:id', (req, res, next) => {
      req.body.apiKey = req.query.apiKey
      const p = mongoDb.collection(collectionPlural).findOneAndReplace(
        {'_id': ObjectId(req.params.id)},
        req.body,
        {returnOriginal: false}
      )
      .then(function resolve(result) {
        res.json((result.value === null) ? {error: bookWerxConstants.ATTEMPTED_IMPLICIT_CREATE} : result.value)
        next()
      })
      p.catch(error => {
        res.json({'error': error})
        next()
      })
     })
  } */

}
