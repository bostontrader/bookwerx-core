let genericRoutes = require('../generic_routes')
let ObjectId = require('mongodb').ObjectId
let collectionSingular = 'account'
let collectionPlural = 'accounts'

exports.defineRoutes = function (server, mongoDb) {
  genericRoutes.get(server, mongoDb, collectionPlural)
  genericRoutes.getOne(server, mongoDb, collectionSingular, collectionPlural)

  //genericRoutes.post(server, mongoDb, collectionPlural)
  // This differs from genericRoutes in that it must update accounts_categories
  //exports.post = function (server, mongoDb, collectionPlural) {
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

    // This has a brand-new _id so assume there are no entries in accounts_categories
    // therefore just make new entries

    // for each category...
      // make new account_category


  //}

  //genericRoutes.put(server, mongoDb, collectionSingular, collectionPlural)
  // This differs from genericRoutes in that it must update accounts_categories
  //exports.put = function (server, mongoDb, collectionSingular, collectionPlural) {
    server.put('/' + collectionPlural + '/:id', (req, res, next) => {
      mongoDb.collection(collectionPlural).findOneAndUpdate(
          {'_id': ObjectId(req.params.id)},
          req.body,
          {returnOriginal: false}).then(function resolve (result) {
        if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
        res.json(result.value)
      }).catch(error => {
        res.json({'error': error})
      })
    }) // then
    //
  //}
  // This is an existing _id.  Delete all of them from accounts_categories first.
  // Now make new entries, like in post


  //genericRoutes.delete(server, mongoDb, collectionSingular, collectionPlural)
  // This differs from genericRoutes in that it must update accounts_categories.
  // Also, cannot delete if we have integrity constraints.
  //exports.delete = function (server, mongoDb, collectionSingular, collectionPlural) {
    server.del('/' + collectionPlural + '/:id', (req, res, next) => {

      // Look for distributions that point here.  Then...

      mongoDb.collection(collectionPlural).findOneAndDelete({'_id': ObjectId(req.params.id)}).then(function resolve (result) {
        if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
        res.json(result.value)
      }).catch(error => {
        res.json({'error': error})
      })
    }) // then

    // Delete all accounts_records with account_id = this one
  //}
  // This is an existing _id.  Delete all of them from accounts_categories.
}
