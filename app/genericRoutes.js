// import bookWerxConstants from './constants'

// const ObjectId = require('mongodb').ObjectId

// Assume proper auth has been done already.  We shouldn't have to authenticate this
// a 2nd time here.  But _be sure_ it's getting done.
// const generic_routes = {
module.exports = {

  /* del: (server, mongoDb, collectionSingular, collectionPlural) => {
    server.del('/' + collectionPlural + '/:id', (req, res, next) => {
      const p = mongoDb.collection(collectionPlural).findOneAndDelete({'_id': ObjectId(req.params.id)})
      .then(function resolve(result) {
        console.log('generic_routes.13',result)
        if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
        res.json(result.value)
        next()
      })
      p.catch(error => {
        console.log('generic_routes.19',result)
        res.json({'error': error})
        next()
      })
    })
  }, */

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

  /* getOne: (server, mongoDb, collectionSingular, collectionPlural) => {
    server.get('/' + collectionPlural + '/:id', (req, res, next) => {
      const p = mongoDb.collection(collectionPlural).findOne({'_id': ObjectId(req.params.id)})
      .then(result => {
        if (result === null) result = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
        res.json(result)
        next()
      })
      p.catch(error => {
        res.json({error: error})
        next()
      })
    })
  }, */

  // post will enable the creation of new documents but will not update or replace existing documents.  Custom _id is prohibited for new documents.
  post: function (server, mongoDb, collectionPlural) {
    server.post('/' + collectionPlural, (req, res, next) => {
      req.body.apiKey = req.query.apiKey
      mongoDb.collection(collectionPlural).insertOne(req.body)
        .then(result => {
          res.json(result)
          next()
        }).catch(error => {
          res.json({error: error})
          next()
        })
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
        console.log('generic_routes.190', result)
        res.json({'error': error})
        next()
      })
     })
  } */

}

// export default generic_routes
