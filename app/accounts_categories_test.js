let AccountsCategoriesTest = function () {
  function AccountsCategoriesTest (client, testdata) {
    this.client = client
    this.testdata = testdata
  }

  /*
   Testing for accounts_categories is more complex because accounts_categories must have
   foreign references to accounts and categories.

   1. Brainwipe

   2.1 POST /categories categoryAsset
   2.2 POST /categories categoryAssetLiquid
   2.3 POST /categories categoryExpense
   2.4 POST /categories categoryExpenseRent

   3.1 POST /accounts accountsBank, pointing to no categories
   3.2 GET /accounts/:accountsBank. Verify that the account's categories and accounts_categories is an empty array.
   3.3 PUT /accounts accountsBank, pointing to categoryExpense
   3.4 GET /accounts/:accountsBank. Verify that the account points to categoryExpense.

   4.1 PUT /accounts accountsBank, pointing to categoryAsset and categoryLiquid.
   4.2 GET /accounts/:accountsBank. Verify that the account points to categoryAsset and categoryLiquid.

   5.1 PUT /accounts accountsExpenseRent, pointing to categoryExpense and categoryExpenseRent.
   5.2 GET /accounts/:accountsExpenseRent. Verify that the account points to categoryExpense and categoryExpenseRent.

   6. GET /accounts.  Verify that each account has two account_category.

   7.1 DELETE /accounts/:accountsExpenseRent.
   7.2 Verify that accounts_categories no longer has any documents pointing to accountsExpenseRent.

  */
  AccountsCategoriesTest.prototype.testRunner = function (pn, testdata) {
    // Phase I Setup
    let collectionPlural
    let priorResults = {}

    // 1. Brainwipe
    return new Promise((resolve, reject) => {
      let url = '/brainwipe'
      console.log('P%s.6 PUT %s', pn, url)
      this.client.put(url, function (err, req, res, obj) {
        if (err) reject(err)
        console.log('P%s.9 %j', pn, obj)
        resolve(priorResults)
      })
    })

    // 2. POST four documents to categories
    .then(priorResults => {
      collectionPlural = 'categories'
      priorResults[collectionPlural] = {}
      return this.post(testdata.categoryAsset, collectionPlural, pn, true, priorResults, 'categoryAsset') // expect success
    })

    .then(priorResults => {
      return this.post(testdata.categoryAssetLiquid, collectionPlural, pn, true, priorResults, 'categoryAssetLiquid') // expect success
    })

    .then(priorResults => {
      return this.post(testdata.categoryExpense, collectionPlural, pn, true, priorResults, 'categoryExpense') // expect success
    })

    .then(priorResults => {
      return this.post(testdata.categoryExpenseRent, collectionPlural, pn, true, priorResults, 'categoryExpenseRent') // expect success
    })

    // 3.1 POST /accounts accountsBank, pointing to no categories
    .then(priorResults => {
      collectionPlural = 'accounts'
      priorResults[collectionPlural] = {}
      let account = JSON.parse(JSON.stringify(testdata.accountBank))
      return this.post(account, collectionPlural, pn, true, priorResults, 'accountBank') // expect success
    })
    // 3.2 GET /accounts/:accountsBank. Verify that the account's accounts_categories is an empty array.
    .then(priorResults => {
      let accountId = priorResults.accounts.accountBank._id
      return this.getOne(accountId, collectionPlural, pn, true, priorResults, 'accountBank') // expect success
    })
    .then(priorResults => {
      return new Promise((resolve, reject) => {
        let account = priorResults.accounts.accountBank
        if (account.accounts_categories) {
          if (account.accounts_categories.length > 0) {
            reject('account should not have any accounts_categories')
          } else {
            resolve(priorResults)
          }
        } else {
          resolve(priorResults)
        }
      })
    })

    // 3.3 PUT /accounts accountsBank, pointing to categoryExpense
    .then(priorResults => {
      let account = priorResults.accounts.accountBank
      let accountId = account._id
      delete account._id
      account.categories = [priorResults.categories.categoryExpense._id]
      return this.put(accountId, account, collectionPlural, pn, true, priorResults, 'accountBank') // expect success
    })

    // 3.4 GET /accounts/:accountsBank. Verify that the account points to categoryExpense.
    .then(priorResults => {
      let accountId = priorResults.accounts.accountBank._id
      return this.getOne(accountId, collectionPlural, pn, true, priorResults, 'accountBank') // expect success
    })

    .then(priorResults => {
      return new Promise((resolve, reject) => {
        let account = priorResults.accounts.accountBank
        if (account.categories) {
          if (account.categories.length !== 1) {
            reject('account should only have one category')
          } else {
            resolve(priorResults)
          }
        } else {
          reject('account should have one category')
        }
      })
    })

    // 4.1 PUT /accounts accountsBank, pointing to categoryAsset and categoryLiquid.
    // 4.2 GET /accounts/:accountsBank. Verify that the account points to categoryAsset and categoryLiquid.

    // 5.1 PUT /accounts accountsExpenseRent, pointing to categoryExpense and categoryExpenseRent.
    // 5.2 GET /accounts/:accountsExpenseRent. Verify that the account points to categoryExpense and categoryExpenseRent.

    // 6. GET /accounts.  Verify that each account has two account_category.

    // 7.1 DELETE /accounts/:accountsExpenseRent.
    // 7.2 Verify that accounts_categories no longer has any documents pointing to accountsExpenseRent.
  }

  // GET /{collectionPlural}/:account_category_id
  AccountsCategoriesTest.prototype.getOne = function (accountsCategoriesId, collectionPlural, pn, fExpectSuccess, priorResults, prKey) {
    return new Promise((resolve, reject) => {
      let url = '/' + collectionPlural + '/' + accountsCategoriesId
      console.log('P%s.3 GET %s', pn, url)
      this.client.get(url, function (err, req, res, obj) {
        if (err) reject(err)
        if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        if (fExpectSuccess && !obj._id) reject('this test must return an _id')
        console.log('P%s.3 %j', pn, obj)
        resolve(priorResults)
        if (prKey) {
          priorResults[collectionPlural][prKey] = obj
        }
        priorResults.mostRecentResult = obj
      })
    })
  }

  // POST /{collectionPlural}
  AccountsCategoriesTest.prototype.post = function (document, collectionPlural, pn, fExpectSuccess, priorResults, prKey) {
    return new Promise((resolve, reject) => {
      let url = '/' + collectionPlural
      console.log('P%s.2 POST %s %j', pn, url, document)
      this.client.post(url, document, function (err, req, res, obj) {
        if (err) reject(err)
        if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        if (fExpectSuccess && !obj._id) reject('this test must generate an _id')
        console.log('P%s.2 %j', pn, obj)
        if (prKey) {
          priorResults[collectionPlural][prKey] = obj
        }
        priorResults.mostRecentResult = obj
        resolve(priorResults)
      })
    })
  }

  // PUT /{collectionPlural}/:account_category_id
  // We cannot rely on the document to contain the account_category_id.  So therefore send the id seperately.
  AccountsCategoriesTest.prototype.put = function (accountsCategoriesId, document, collectionPlural, pn, fExpectSuccess, priorResults, prKey) {
    return new Promise((resolve, reject) => {
      let url = '/' + collectionPlural + '/' + accountsCategoriesId
      console.log('P%s.4 PUT %s %j', pn, url, document)
      this.client.put(url, document, function (err, req, res, obj) {
        if (err) reject(err)
        if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        if (fExpectSuccess && !obj._id) reject('this test must generate an _id')
        console.log('P%s.4 %j', pn, obj)
        if (prKey) {
          priorResults[collectionPlural][prKey] = obj
        }
        priorResults.mostRecentResult = obj
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
