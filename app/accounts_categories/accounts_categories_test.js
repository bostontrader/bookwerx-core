let AccountsCategoriesTest = function () {
  function AccountsCategoriesTest (client, testdata) {
    this.client = client
    this.testdata = testdata
  }

  /*
   CRUD for accounts_categories is more complex because accounts_categories must have
   foreign references to accounts and categories.

   Phase I. Setup

   1. We therefore must first establish two of each (so that we can test changing
   references to them.)

   Phase II. Basic CRUD

   1. POST a new account_category using good, bad, and no references to
   each of account_id and category_id. (6 tests).

   2. PUT to an existing account_category, using good and bad references,
   to each of account_id and category_id. (4 tests). In this case we don't care about
   missing references because missing means "no change".

   3. Now we have a good account_category that references an existing account and category.
   Now we can try to delete these items to test that referential integrity is preserved.

   4. Now DELETE using a good and bad accounts_categories_id.

   Note: We don't care to be able to GET /accounts_distributions or GET /accounts_distributions/:id

   Phase III. Test changing of references to an account.

   1. If we retrieve the account document, does it refer to zero account_category?

   2.1 POST to the account_category to make a 1st account_category that points to the account.

   2.2 If we retrieve the account document, does it refer to one account_category? The correct one?

   3.1 PUT to the account_category to make it point to another category.

   3.2 If we retrieve the account document, does it refer to one account_category? The correct one?

   4.1 POST to the account_category to make a 2nd account_category that points to the account.

   4.2 If we retrieve the account document, does it refer to two account_category document? (Assume they
   are the correct documents.)

   Phase IV. Test changing of references to an category.
   // Not yet implemented.  Maybe later.

   Phase V.

   1. Test that we can delete the account_category.

   Note: We might be tempted to test that POST and PUT do not create documents where account_id and category_id
   duplicate other documents.  This is not necessary.  The UI will not enable this to happen and even if
   it does, what are the consequences?  That's right, minimal.  Test this later if you like.

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

    // Phase I Setup

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

    // now POST a good account_category
    .then(priorResults => {
      return this.post(buildAccountCategory(), collectionPlural, pn, true, priorResults) // expect success
    })
    // now POST a 2nd good account_category
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
    // .then(priorResults => {
      // let accountCategoryId = priorResults.accounts_categories[0]._id.toString()
      // return this.getOne(accountCategoryId, collectionPlural, pn, true, priorResults) // expect success
    // })

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

    // GET the account document. Does it refer to the account_category?
    .then(priorResults => {
      let accountId = priorResults.accounts[0]._id.toString()
      return this.getOne(accountId, 'accounts', pn, true, priorResults) // expect success
    })
    .then(priorResults => {
      return new Promise((resolve, reject) => {
        resolve(true)
        // let idx = priorResults.accounts.length-1
        // let account = priorResults.accounts[idx]
        // if(!account.accounts_categories) reject('account must refer to accounts_categories')
      })
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
