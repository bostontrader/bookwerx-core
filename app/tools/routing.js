exports.defineRoutes = function (server, mongoDb) {
  server.put('/brainwipe', (req, res, next) => {
    mongoDb.dropDatabase().then(result => {
      res.json(result)
    })
    .catch(error => {
      res.json({'error': error})
    })
  })

  // Let's find a better name
  server.get('/catfood', (req, res, next) => {
    // 1. Given a category symbol, find all accounts_categories that match
    // 2. From that, produce an array of all account_ids that are thus tagged by said category.
    // 3. distributions.find ({account_id in [ accounts_ids]})
    // 4. lookup the transaction info
    // 5. group on period, calculate sum

    let target = 'Ex' // hardwire hack. Replace this.
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
          {$project: {_id: false, amount: true, currency_id: true, yy: {$year: '$transaction_info.datetime'}}},
          {$group: {_id: '$yy', total: {$sum: '$amount'}}}
        ]).toArray()

        .then(result => {
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
