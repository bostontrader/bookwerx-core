let DistributionsTest = function () {
  function DistributionsTest (c, cs, cp, nd1, nd2) {
    this.client = c
    this.collectionSingular = cs
    this.collectionPlural = cp
    this.newDocument1 = nd1
    this.newDocument2 = nd2
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

   */
  DistributionsTest.prototype.testRunner = function (pn, testdata, priorResults) {
    this.collectionSingular = 'account'
    this.collectionPlural = 'accounts'
    this.newDocument1 = testdata.accountBank
    this.newDocument2 = testdata.accountCash

    // 1. POST two documents to accounts
    return this.post(this.newDocument1, pn, true, priorResults) // expect success
      .then(priorResults => {
        return this.post(this.newDocument2, pn, true, priorResults) // expect success
      })

      // POST two documents to currencies
      .then(priorResults => {
        this.collectionSingular = 'currency'
        this.collectionPlural = 'currencies'
        return this.post(testdata.currencyCNY, pn, true, priorResults) // expect success
      })
      .then(priorResults => {
        return this.post(testdata.currencyRUB, pn, true, priorResults) // expect success
      })

      // POST two documents to transactions
      .then(priorResults => {
        this.collectionSingular = 'transaction'
        this.collectionPlural = 'transactions'
        return this.post(testdata.transaction1, pn, true, priorResults) // expect success
      })
      .then(priorResults => {
        return this.post(testdata.transaction2, pn, true, priorResults) // expect success
      })

      // POST a distribution that would ordinarily be good, except...
      // ... missing an account_id
      .then(priorResults => {
        this.collectionSingular = 'distribution'
        this.collectionPlural = 'distributions'
        // let dist = {'drcr': 1, 'amount': 0, 'currency_id': '666666666666666666666666', 'transaction_id': '666666666666666666666666'}
        // return this.post(dist, pn, false, priorResults) // expect fail
      })

        // ... using a bad account_id
        // .then(priorResults => {
          // this.collectionSingular = 'distribution'
          // this.collectionPlural = 'distributions'
          // let dist = {'drcr': 1, 'account_id': '666666666666666666666666', 'amount': 0, 'currency_id': '666666666666666666666666', 'transaction_id': '666666666666666666666666'}
          // return this.post(dist, pn, false, priorResults) // expect fail
        // })

        // POST a distribution that would ordinarily be good, except missing a currency_id
        // POST a distribution that would ordinarily be good, except missing a transaction_id
        // POST a good distribution

        // PUT a distribution that would ordinarily be good, except missing an account_id
        // PUT a distribution that would ordinarily be good, except missing a currency_id
        // PUT a distribution that would ordinarily be good, except missing a transaction_id
        // PUT a good distribution

        // Try to delete the account, watch it fail.
        // Try to delete the currency, watch it fail.
        // Try to delete the transaction, watch it fail.
  }

  // GET /{collectionPlural} and look for the correct operation of returning
  // the correct number of array elements.
  /* DistributionsTest.prototype.getMany = function (expectedCnt, pn, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + this.collectionPlural
      console.log('P%s.1 GET %s', pn, url)
      this.client.get(url, function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== expectedCnt) reject('Expecting ' + expectedCnt + ' documents, found ' + obj.length + ' documents')
        console.log('P%s.1 %j', pn, obj)
        if (obj.length > 0) priorResults['goodId'] = obj[0]['_id']
        resolve(priorResults)
      })
    })
  }*/

  // GET /{collectionPlural}/:id
  /* DistributionsTest.prototype.getOne = function (id, pn, fExpectSuccess, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + this.collectionPlural + '/' + id
      console.log('P%s.3 GET %s', pn, url)
      this.client.get(url, function (err, req, res, obj) {
        if (err) reject(err)
        if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        console.log('P%s.3 %j', pn, obj)
        resolve(priorResults)
      })
    })
  }*/

  // POST /{collectionPlural}
  DistributionsTest.prototype.post = function (document, pn, fExpectSuccess, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + this.collectionPlural
      console.log('P%s.2 POST %s %j', pn, url, document)
      this.client.post(url, document, function (err, req, res, obj) {
        if (err) reject(err)
        if (!obj._id) reject('this test must generate an _id')
        console.log('P%s.2 %j', pn, obj)
        resolve(priorResults)
      })
    })
  }

  // PUT /{collectionPlural}/:id
  /* DistributionsTest.prototype.put = function (id, document, pn, fExpectSuccess, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + this.collectionPlural + '/' + id
      console.log('P%s.4 PUT %s %j', pn, url, document)
      this.client.put(url, document, function (err, req, res, obj) {
        if (err) reject(err)
        if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        console.log('P%s.4 %j', pn, obj)
        resolve(priorResults)
      })
    })
  }*/

  // DELETE /{collectionPlural}/:id
  /* DistributionsTest.prototype.delete = function (id, pn, fExpectSuccess, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + this.collectionPlural + '/' + id
      console.log('P%s.5 DELETE %s', pn, url)
      this.client.del(url, function (err, req, res, obj) {
        if (err) reject(err)
        if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        console.log('P%s.5 %j', pn, obj)
        resolve(priorResults)
      })
    })
  }
   */

  return DistributionsTest
}

module.exports = DistributionsTest()
