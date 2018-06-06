
/* let DistributionsTest = function () {
  function DistributionsTest (client, testdata) {
    this.client = client
    this.testdata = testdata
  }

  /*
    1. Generic crud for transactions is ok because we can have tx
    w/o other foreign references. So it is tested elsewhere.

    CRUD for distributions is more complex because distributions must have
    certain foreign references such as to accounts, currencies, and transactions.

    2. We therefore must first establish two of each (so that we can test changing
     references to them.)

    3. Then we try to POST and PUT, using good, bad, and no references for each.

    4. Finally, we have a good distribution that references accounts, currencies, and transactions.
    So now we can try to delete these items to test that referential integrity is preserved.

   /
  DistributionsTest.prototype.testRunner = function (pn, testdata, priorResults) {
    // buildDist will build a suitable distribution for use in testing.
    // If invoked with no args, then return a valid distribution example.
    // If invoked with only a defectiveField, then remove that field from the otherwise
    // valid document.
    // If invoked with a defectiveField and a defectiveValue, replace said field with the value.
    let buildDist = function (defectiveField, defectiveValue) {
      // Start with a valid distribution
      let dist = {'drcr': 1, 'amount': 0, 'account_id': priorResults.accounts[0]._id, 'currency_id': priorResults.currencies[0]._id, 'transaction_id': priorResults.transactions[0]._id}
      if (defectiveField) {
        if (defectiveValue) {
          dist[defectiveField] = defectiveValue
        } else {
          delete dist[defectiveField]
        }
      }
      return dist
    }

    // 1. POST two documents to accounts
    let collectionPlural = 'accounts'
    priorResults[collectionPlural] = []
    return this.post(testdata.accountBank, collectionPlural, pn, true, priorResults) // expect success
      .then(priorResults => {
        return this.post(testdata.accountCash, collectionPlural, pn, true, priorResults) // expect success
      })

      // POST two documents to currencies
      .then(priorResults => {
        collectionPlural = 'currencies'
        priorResults[collectionPlural] = []
        return this.post(testdata.currencyCNY, collectionPlural, pn, true, priorResults) // expect success
      })
      .then(priorResults => {
        return this.post(testdata.currencyRUB, collectionPlural, pn, true, priorResults) // expect success
      })

      // POST two documents to transactions
      .then(priorResults => {
        collectionPlural = 'transactions'
        priorResults[collectionPlural] = []
        return this.post(testdata.transaction1, collectionPlural, pn, true, priorResults) // expect success
      })
      .then(priorResults => {
        return this.post(testdata.transaction2, collectionPlural, pn, true, priorResults) // expect success
      })

      // POST a distribution that would ordinarily be good, except...

      // ... missing an account_id
      .then(priorResults => {
        collectionPlural = 'distributions'
        priorResults[collectionPlural] = []
        return this.post(buildDist('account_id'), collectionPlural, pn, false, priorResults) // expect fail
      })

      // ... missing a currency_id
      .then(priorResults => {
        return this.post(buildDist('currency_id'), collectionPlural, pn, false, priorResults) // expect fail
      })

      // ... missing a transaction_id
      .then(priorResults => {
        return this.post(buildDist('transaction_id'), collectionPlural, pn, false, priorResults) // expect fail
      })

      // ... using a bad account_id
      .then(priorResults => {
        return this.post(buildDist('account_id', '666666666666666666666666'), collectionPlural, pn, false, priorResults) // expect fail
      })

      // ... using a bad currency_id
      .then(priorResults => {
        return this.post(buildDist('currency_id', '666666666666666666666666'), collectionPlural, pn, false, priorResults) // expect fail
      })

      // ... using a bad transaction_id
      .then(priorResults => {
        return this.post(buildDist('transaction_id', '666666666666666666666666'), collectionPlural, pn, false, priorResults) // expect fail
      })

      // now POST a good distribution
      .then(priorResults => {
        return this.post(buildDist(), collectionPlural, pn, true, priorResults) // expect success
      })

      // Now PUT a distribution that would ordinarily be good, except...

      // ... missing an account_id
      // ... missing a currency_id
      // ... missing a transaction_id
      // We don't care about the above because if the key is missing then no change is being made.

      // But we _do_ care if we change one of those keys to an invalid key.
      .then(priorResults => {
        let dist = buildDist('account_id', '666666666666666666666666')
        let distributionId = priorResults.distributions[0]._id.toString()
        return this.put(distributionId, dist, collectionPlural, pn, false, priorResults) // expect fail
      })

      .then(priorResults => {
        let dist = buildDist('currency_id', '666666666666666666666666')
        let distributionId = priorResults.distributions[0]._id.toString()
        return this.put(distributionId, dist, collectionPlural, pn, false, priorResults) // expect fail
      })

      .then(priorResults => {
        let dist = buildDist('transaction_id', '666666666666666666666666')
        let distributionId = priorResults.distributions[0]._id.toString()
        return this.put(distributionId, dist, collectionPlural, pn, false, priorResults) // expect fail
      })

      // now PUT a good distribution
      .then(priorResults => {
        let dist = buildDist()
        let distributionId = priorResults.distributions[0]._id.toString()
        return this.put(distributionId, dist, collectionPlural, pn, true, priorResults) // expect success
      })

      // now GET an existing distribution
      .then(priorResults => {
        let distributionId = priorResults.distributions[0]._id.toString()
        return this.getOne(distributionId, collectionPlural, pn, true, priorResults) // expect success
      })

      // Try to delete the account, watch it fail because a distribution references it.
      .then(priorResults => {
        let accountId = priorResults.distributions[0].account_id.toString()
        return this.delete(accountId, 'accounts', pn, false, priorResults) // expect fail
      })

      // Try to delete the currency, watch it fail because a distribution references it.
      .then(priorResults => {
        let currencyId = priorResults.distributions[0].currency_id.toString()
        return this.delete(currencyId, 'currencies', pn, false, priorResults) // expect fail
      })

      // Try to delete the transaction, watch it fail because a distribution references it.
      .then(priorResults => {
        let transactionId = priorResults.distributions[0].transaction_id.toString()
        return this.delete(transactionId, 'transactions', pn, false, priorResults) // expect fail
      })
  }

  // GET /{collectionPlural}/:distribution_id
  DistributionsTest.prototype.getOne = function (distributionId, collectionPlural, pn, fExpectSuccess, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + collectionPlural + '/' + distributionId
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
  DistributionsTest.prototype.post = function (document, collectionPlural, pn, fExpectSuccess, priorResults) {
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

  // PUT /{collectionPlural}/:distribution_id
  // We cannot rely on the document to contain the distribution_id.  So therefore send the id seperately.
  DistributionsTest.prototype.put = function (distributionId, document, collectionPlural, pn, fExpectSuccess, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + collectionPlural + '/' + distributionId
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
  DistributionsTest.prototype.delete = function (id, collectionPlural, pn, fExpectSuccess, priorResults) {
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

  return DistributionsTest
}

module.exports = DistributionsTest()
*/
