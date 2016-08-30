let genericRoutes = require('../generic_routes')
let ObjectId = require('mongodb').ObjectId
let collectionSingular = 'account'
let collectionPlural = 'accounts'

exports.defineRoutes = function (server, mongoDb) {
  genericRoutes.get(server, mongoDb, collectionPlural)

  // genericRoutes.getOne(server, mongoDb, collectionSingular, collectionPlural)

  // This differs from genericRoutes in that it must retrieve related account_category records.
  server.get('/' + collectionPlural + '/:id', (req, res, next) => {
    mongoDb.collection('accounts')
      .aggregate([
        {$match: {_id: ObjectId(req.params.id)}},
        {
          $lookup: {
            from: 'accounts_categories',
            localField: '_id',
            foreignField: 'account_id',
            as: 'accounts_categories'
          }
        }
      ]).toArray()

    .then(priorResults => {
      return new Promise((resolve, reject) => {
        if (priorResults.length > 0) {
          let account = priorResults[0]
          priorResults = {account: account}
        }
        resolve(priorResults)
      })
    })

    .then(priorResults => {
      return new Promise((resolve, reject) => {
        if (priorResults.account) {
          let n = []
          let accountCategories = priorResults.account.accounts_categories
          for (let idx in accountCategories) {
            let accountCategory = accountCategories[idx]
            n.push(accountCategory.category_id)
          }
          priorResults.categories = n
        }
        resolve(priorResults)
      })
    })

    .then(priorResults => {
      if (priorResults.account) {
        let n = priorResults
        return new Promise((resolve, reject) => {
          mongoDb.collection('categories').find().toArray().then(results => {
            n.account.accounts_categories = results
            resolve(n)
          }).catch(error => {
            reject({error: error})
          })
        })
      }
    })

    .then(result => {
      if (!result.account) {
        result = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
      } else {
        result = result.account
      }
      res.json(result)
      // next()
    })
    .catch(error => {
      res.json({error: error})
    })
  })

  // genericRoutes.post(server, mongoDb, collectionPlural)
  // This differs from genericRoutes in that it must update accounts_categories
  // WARNING! This should all be in a transaction!
  server.post('/' + collectionPlural, (req, res, next) => {
    // insertOne only returns the new _id.  We want to return complete
    // new document, which is what we originally requested to store
    // with the new _id added to this.
    let retVal = req.body
    mongoDb.collection(collectionPlural).insertOne(req.body)
    .then(result => {
      retVal._id = result.insertedId.toString()

      // This has a brand-new _id so assume there are no entries in accounts_categories
      // therefore just make new entries
      // for each category...
      // make new account_category
      let n = []
      var categories = retVal.categories
      for (let categoryIdx in categories) {
        n.push({'accounts_id': retVal._id, 'categories_id': categories[categoryIdx]})
      }
      mongoDb.collection(collectionPlural).insertMany(n)
    })
    .then(result => {
      res.json(retVal)
    }).catch(error => {
      res.json({error: error})
    })
  })

  // genericRoutes.put(server, mongoDb, collectionSingular, collectionPlural)
  // This differs from genericRoutes in that it must update accounts_categories
  // exports.put = function (server, mongoDb, collectionSingular, collectionPlural) {
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
  // }
  // This is an existing _id.  Delete all of them from accounts_categories first.
  // Now make new entries, like in post

  // genericRoutes.delete(server, mongoDb, collectionSingular, collectionPlural)
  // This differs from genericRoutes in that it must not delete if other
  // foreign keys refer to it.  Presently, only distributions and accounts_categories.
  // Note: DELETE does not have a body, so find the account_id in req.params
  server.del('/' + collectionPlural + '/:account_id', (req, res, next) => {
    let accountId = ObjectId(req.params.account_id)
    Promise.all([
      new Promise((resolve, reject) => {
        mongoDb.collection('distributions').findOne({'account_id': accountId}).then(result => {
          if (result === null) {
            resolve(true)
          } else {
            let msg = 'Cannot delete this account because distributions ' + result._id.toString() + ' refers to it'
            reject(msg)
          }
        })
      }),
      new Promise((resolve, reject) => {
        mongoDb.collection('accounts_categories').findOne({'account_id': accountId}).then(result => {
          if (result === null) {
            resolve(true)
          } else {
            let msg = 'Cannot delete this account because accounts_categories ' + result._id.toString() + ' refers to it'
            reject(msg)
          }
        })
      })
    ])
    .then((result) => {
      mongoDb.collection(collectionPlural).findOneAndDelete({'_id': accountId})
      .then(function resolve (result) {
        if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
        res.json(result.value)
      })
    })
    .catch(error => {
      res.json({error: error})
    })
  })

  /*
   The account dashboard requires a list of all distributions for a particular account,
   listed in transaction_datetime order, as well as other various joined fields such as a currency symbol.
   In addition, we also want info from the account document itself.

   More particularly, we want:

   {
     "account":{ "title": "Cash in Mattress"},
     "distributions":{

       "_id":"...",
       "currency_id":"456",
       "amount":500,
       "account_id":"...",
       "transaction_id":"123",
       "transaction_info":[
         {"_id":"123","note":"Deposit more cash","datetime":"2014-06-30 00:00:00"}
       ],
       "currency_info":[
         {"_id":"456","symbol":"RMB","title":"Ren Min Bi"}
       ]
     }
   }

   We produce this with two queries to the db.  One to get the account info, and one to get the distribution (and
   joined) info.

   Even though transaction_info and currency_info are arrays (cuz that's how mongo rolls), in this app, there should only
   be exactly one of each.

   Most of the time the currency should be exactly the same for each distribution and this join seems unnecessary.
   However, there are times when more than one currency may be used, for a given account.

   */

  server.get('/accounts/dashboard/:account_id', (req, res, next) => {
    let distributions
    return mongoDb.collection('distributions')
        .aggregate([
          {$match: {account_id: ObjectId(req.params.account_id)}},
          {
            $lookup: {
              from: 'transactions',
              localField: 'transaction_id',
              foreignField: '_id',
              as: 'transaction_info'
            }
          },
          {
            $lookup: {
              from: 'currencies',
              localField: 'currency_id',
              foreignField: '_id',
              as: 'currency_info'
            }
          },
          {$sort: {'currency_info.symbol': 1, 'transaction_info.datetime': 1}}
        ]).toArray()
        .then(result => {
          distributions = result
          return mongoDb.collection('accounts').findOne({'_id': ObjectId(req.params.account_id)})
        })
        .then(result => {
          res.json({'distributions': distributions, 'account': result})
        }).catch(error => {
          res.json({'error': error})
        })
  })
}
