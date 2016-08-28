let AccountsCategoriesTest = function () {
  function AccountsCategoriesTest (client, testdata) {
    this.client = client
    this.testdata = testdata
  }

  /*
   CRUD for accounts_categories is more complex because accounts_categories must have
   foreign references to accounts and categories.

   We therefore must first establish two of each (so that we can test changing
   references to them.)

   Then we try to POST and PUT, using good, bad, and no references for each.

   Finally, we have a good account_category that references accounts and categories.
   So now we can try to delete these items to test that referential integrity is preserved.
  */
  AccountsCategoriesTest.prototype.testRunner = function (pn, testdata, priorResults) {
    // buildAccountCategory will build a suitable account_category for use in testing.
    // If invoked with no args, then return a valid account_category example.
    // If invoked with only a defectiveField, then remove that field from the otherwise
    // valid document.
    // If invoked with a defectiveField and a defectiveValue, replace said field with the value.
    let buildAccountCategory = function (defectiveField, defectiveValue) {
      // Start with a valid account_category
      let accountCategory = {'account_id': priorResults.accounts[0]._id, 'category_id': priorResults.categories[0]._id}
      if (defectiveField) {
        if (defectiveValue) {
          accountCategory[defectiveField] = defectiveValue
        } else {
          delete accountCategory[defectiveField]
        }
      }
      return accountCategory
    }

    // 1. POST two documents to accounts
    let collectionPlural = 'accounts'
    priorResults[collectionPlural] = []
    return this.post(testdata.accountBank, collectionPlural, pn, true, priorResults) // expect success
    .then(priorResults => {
      return this.post(testdata.accountCash, collectionPlural, pn, true, priorResults) // expect success
    })

    // POST two documents to categories
    .then(priorResults => {
      collectionPlural = 'categories'
      priorResults[collectionPlural] = []
      return this.post(testdata.categoryAsset, collectionPlural, pn, true, priorResults) // expect success
    })
    .then(priorResults => {
      return this.post(testdata.categoryExpense, collectionPlural, pn, true, priorResults) // expect success
    })

    // POST an account_category that would ordinarily be good, except...

    // ... missing an account_id
    .then(priorResults => {
      collectionPlural = 'accounts_categories'
      priorResults[collectionPlural] = []
      return this.post(buildAccountCategory('account_id'), collectionPlural, pn, false, priorResults) // expect fail
    })

    // ... missing a category_id
    .then(priorResults => {
      return this.post(buildAccountCategory('category_id'), collectionPlural, pn, false, priorResults) // expect fail
    })

    // ... using a bad account_id
    .then(priorResults => {
      return this.post(buildAccountCategory('account_id', '666666666666666666666666'), collectionPlural, pn, false, priorResults) // expect fail
    })

    // ... using a bad category_id
    .then(priorResults => {
      return this.post(buildAccountCategory('category_id', '666666666666666666666666'), collectionPlural, pn, false, priorResults) // expect fail
    })

    // now POST a good distribution
    .then(priorResults => {
      return this.post(buildAccountCategory(), collectionPlural, pn, true, priorResults) // expect success
    })

    // Now PUT an account_category that would ordinarily be good, except...

    // ... missing an account_id
    // ... missing a category_id
    // We don't care about the above because if the key is missing then no change is being made.

    // But we _do_ care if we change one of those keys to an invalid key.
    .then(priorResults => {
      let accountCategory = buildAccountCategory('account_id', '666666666666666666666666')
      let accountCategoryId = priorResults.accounts_categories[0]._id.toString()
      return this.put(accountCategoryId, accountCategory, collectionPlural, pn, false, priorResults) // expect fail
    })

    .then(priorResults => {
      let accountCategory = buildAccountCategory('category_id', '666666666666666666666666')
      let accountCategoryId = priorResults.accounts_categories[0]._id.toString()
      return this.put(accountCategoryId, accountCategory, collectionPlural, pn, false, priorResults) // expect fail
    })

    // now PUT a good account_category
    .then(priorResults => {
      let dist = buildAccountCategory()
      let accountCategoryId = priorResults.accounts_categories[0]._id.toString()
      return this.put(accountCategoryId, dist, collectionPlural, pn, true, priorResults) // expect success
    })

    // now GET an existing account_category
    .then(priorResults => {
      let accountCategoryId = priorResults.accounts_categories[0]._id.toString()
      return this.getOne(accountCategoryId, collectionPlural, pn, true, priorResults) // expect success
    })

    // Try to delete the account, watch it fail because an account_category references it.
    .then(priorResults => {
      let accountId = priorResults.accounts_categories[0].account_id.toString()
      return this.delete(accountId, 'accounts', pn, false, priorResults) // expect fail
    })

    // Try to delete the category, watch it fail because an account_category references it.
    .then(priorResults => {
      let categoryId = priorResults.accounts_categories[0].category_id.toString()
      return this.delete(categoryId, 'categories', pn, false, priorResults) // expect fail
    })
  }

  // GET /{collectionPlural}/:account_category_id
  AccountsCategoriesTest.prototype.getOne = function (accountsCategoriesId, collectionPlural, pn, fExpectSuccess, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + collectionPlural + '/' + accountsCategoriesId
      console.log('P%s.3 GET %s', pn, url)
      this.client.get(url, function (err, req, res, obj) {
        if (err) reject(err)
        if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        if (fExpectSuccess && !obj._id) reject('this test must return an _id')
        console.log('P%s.3 %j', pn, obj)
        resolve(priorResults)
      })
    })
  }

  // POST /{collectionPlural}
  AccountsCategoriesTest.prototype.post = function (document, collectionPlural, pn, fExpectSuccess, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + collectionPlural
      console.log('P%s.2 POST %s %j', pn, url, document)
      this.client.post(url, document, function (err, req, res, obj) {
        if (err) reject(err)
        if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        if (fExpectSuccess && !obj._id) reject('this test must generate an _id')
        console.log('P%s.2 %j', pn, obj)
        if (fExpectSuccess) priorResults[collectionPlural].push(obj)
        resolve(priorResults)
      })
    })
  }

  // PUT /{collectionPlural}/:account_category_id
  // We cannot rely on the document to contain the account_category_id.  So therefore send the id seperately.
  AccountsCategoriesTest.prototype.put = function (accountsCategoriesId, document, collectionPlural, pn, fExpectSuccess, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + collectionPlural + '/' + accountsCategoriesId
      console.log('P%s.4 PUT %s %j', pn, url, document)
      this.client.put(url, document, function (err, req, res, obj) {
        if (err) reject(err)
        if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        if (fExpectSuccess && !obj._id) reject('this test must generate an _id')
        console.log('P%s.4 %j', pn, obj)
        priorResults[collectionPlural].push(obj)
        resolve(priorResults)
      })
    })
  }

  // DELETE /{collectionPlural}/:id
  AccountsCategoriesTest.prototype.delete = function (id, collectionPlural, pn, fExpectSuccess, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + collectionPlural + '/' + id
      console.log('P%s.5 DELETE %s', pn, url)
      this.client.del(url, function (err, req, res, obj) {
        if (err) reject(err)
        if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        console.log('P%s.5 %j', pn, obj)
        resolve(priorResults)
      })
    })
  }

  return AccountsCategoriesTest
}

module.exports = AccountsCategoriesTest()

