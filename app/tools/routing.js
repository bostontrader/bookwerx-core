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

   Presently, this route is given an account category and will return the sum of account balance
   changes during each monthly period as well as a count of the distributions that contribute
   to it.  For example:

   GET /distribution_summary?category=Bank
   Returns something like...
   [
     {"_id":{"y":2015,"m":9},"t":10000","c":1},
     {"_id":{"y":2015,"m":10},"t":-8000,"c":2},
     {"_id":{"y":2015,"m":11},"t":0,"c":0},
     {"_id":{"y":2015,"m":12},"t":-4000,"c":2}
   ]

   These example results tell us that the first transaction for any account categorized as "Bank"
   happened in Sep 2015, the last one was in Dec 2015, and that there were no transactions during
   Nov 2015.  The bank balances increased by 10000 during Sep 2015, decreased by 8000 in Oct 2015.
   The bank balances at the end of November 2015 were 2000 and were overdrawn by 2000 at the end of Dec 2015.

   Roadmap:

   It will probably be nice to eventually extend this to cover the following changes:

   The results should be segregated by currency and include a currency conversion to a target currency.

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
          {$project: {_id: false, amount: true, currency_id: true, yy: {$year: '$transaction_info.datetime'}, mm: {$month: '$transaction_info.datetime'}}},
          {$group: {_id: {y: '$yy', m: '$mm'}, t: {$sum: '$amount'}, c: {$sum: 1}}},
          {$sort: {_id: 1}}
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

  // Let's find a better name
  server.get('/catfood2', (req, res, next) => {
    // 1. Given a category and a currency symbol, find all accounts_categories that match
    // 2. From that, produce an array of all account_ids that are thus tagged by said category.
    // 3. distributions.find ({account_id in [ accounts_ids]})
    // 4. lookup the transaction info
    // 5. group on period, calculate sum

    let target = 'Bank' // hardwire hack. Replace this.
    mongoDb.collection('categories').aggregate([
      {$match: {symbol: target}},
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
              {$project: {_id: false, amount: true, currency_id: true, yy: {$year: '$transaction_info.datetime'}, mm: {$month: '$transaction_info.datetime'}}},
              {$group: {_id: {y: '$yy', m: '$mm'}, t: {$sum: '$amount'}, c: {$sum: 1}}},
              {$sort: {_id: 1}}
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
}
