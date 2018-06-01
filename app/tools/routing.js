exports.defineRoutes = function (server, mongoDb) {
  server.put('/brainwipe', (req, res, next) => {
    mongoDb.dropDatabase().then(result => {
      res.json(result)
    })
    .catch(error => {
      res.json({'error': error})
    })
  })

  /*
   Financial reports typically want account balances at the end of certain periods or the quantity
   of activity during a particular period.  This can be generally implemented by calculating a
   sum of account activity during all time periods and then using these sums as the input to subsequent
   processing. This route provides the basic summary.  The client can further tweak the results.

   Presently, this route calculates said sum for all accounts tagged by a particular category, and
   groups it by year, month, and currency_id. It also returns the count of distributions for each group.
   For example:

   GET /distribution_summary?category=Bank
   Returns something like...
   [
     {"_id":{"y":2015,"m":9, "currency_id":"aaa"},"t":10000","c":1},
     {"_id":{"y":2015,"m":10, "currency_id":"aaa"}},"t":-8000,"c":2},
     {"_id":{"y":2015,"m":11, "currency_id":"aaa"}},"t":0,"c":0},
     {"_id":{"y":2015,"m":11, "currency_id":"bbb"}},"t":500,"c":2},
     {"_id":{"y":2015,"m":12, "currency_id":"aaa"}},"t":-4000,"c":2}
   ]

   These example results tell us that the first transaction for any account categorized as "Bank"
   happened in Sep 2015 and the last one was in Dec 2015.  All of the relevant distributions used currency "aaa",
   except for two distributions in November 2015, which used currency "bbb".  There were no transactions during
   Nov 2015 that used currency "aaa".  The currency "aaa" bank balances increased by 10000 during Sep 2015,
   and decreased by 8000 in Oct 2015.
   The bank balances at the end of November 2015, for currency "aaa" were 2000 and were overdrawn by 2000 at the
   end of Dec 2015.

   Sometimes we want to expand the above output to include specific details about which specific
   accounts, as well as their associated balances, were used.

   GET /distribution_summary?category=Bank&accounts=true
   Returns something like...
   [
     {"_id":{"y":2015,"m":9, "currency_id":"aaa" , "account_id":"Bank A"},"t":10000","c":1},
     {"_id":{"y":2015,"m":10, "currency_id":"aaa" , "account_id":"Bank B"}},"t":-8000,"c":2},
     {"_id":{"y":2015,"m":11, "currency_id":"aaa" , "account_id":"Bank C"}},"t":0,"c":0}
   ]

   Roadmap:

   It will probably be nice to eventually extend this to cover the following changes:

   Perhaps we should be able to specify:
   * A list of categories.
   * A single account number.
   * A list of account numbers.

  */

  server.get('/distribution_summary', (req, res, next) => {
    let targetCategory = req.query.category
    mongoDb.collection('categories').aggregate([
      {$match: {symbol: targetCategory}},
      {$lookup: {
        from: 'accounts_categories',
        localField: '_id',
        foreignField: 'category_id',
        as: 'accounts_categories'
      }}
    ]).toArray()

    // 2. From that, produce an array of all account_ids that are thus tagged by said category.
    .then(result => {
      let accountCategories = result[0].accounts_categories
      return new Promise((resolve, reject) => {
        let n = []
        for (let idx in accountCategories) {
          let accountCategory = accountCategories[idx]
          n.push(accountCategory.account_id)
        }
        resolve(n)
      })
    })

    // 3-5. Find distributions and summarize them.
    .then(result => {
      return new Promise((resolve, reject) => {
        mongoDb.collection('distributions').aggregate([
          {$match: {account_id: {$in: result}}},
          {$lookup: {
            from: 'transactions',
            localField: 'transaction_id',
            foreignField: '_id',
            as: 'transaction_info'
          }},
          {$unwind: '$transaction_info'},
          {$project: {_id: false, amount: true, currency_id: true, account_id:true, yy: {$year: '$transaction_info.datetime'}, mm: {$month: '$transaction_info.datetime'}}},
          {$group: {_id: {y: '$yy', m: '$mm', account_id:'$account_id', currency_id:'$currency_id'}, t: {$sum: '$amount'}, c: {$sum: 1}}},
          {$sort: {_id: 1}},
          {$lookup: {
            from: 'accounts',
            localField: '_id.account_id',
            foreignField: '_id',
            as: 'account_info'
          }},
          {$lookup: {
            from: 'currencies',
            localField: '_id.currency_id',
            foreignField: '_id',
            as: 'currency_info'
          }}
        ]).toArray()

        .then(result => {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With')
          res.json(result)
        })
        .catch(error => {
          reject({error: error})
        })
      })
    })

    .catch(error => {
      res.json({error: error})
    })
  })

  // Look for transactions that have no distributions
  server.get('/lint1', (req, res, next) => {
    mongoDb.collection('transactions').aggregate([
      {$lookup: {
        from: 'distributions',
        localField: '_id',
        foreignField: 'transaction_id',
        as: 'distributions'
      }}
    ]).toArray()

    .then(result => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With')
      res.json(result.filter(value => {
        return value.distributions.length == 0
      }))
    })
    .catch(error => {
      reject({error: error})
    })
  })
}
