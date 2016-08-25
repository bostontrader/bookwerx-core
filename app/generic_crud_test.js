/*
Several collections, such as accounts, categories, and currencies need identical
CRUD testing.  This class provides that capability.

Other collections such as transactions, distributions, and accounts_categories,
although also needing a fair amount of CRUD testing, are so encrusted with unique
operations, such as contraints of referential integrity, that they don't use this
class
 */

let CRUDTest = function() {

  function CRUDTest(c, cs, cp, nd1, nd2) {
    this.client = c
    this.collectionSingular = cs
    this.collectionPlural = cp
    this.newDocument1 = nd1
    this.newDocument2 = nd2
  }

  CRUDTest.prototype.testRunner = function (pn, priorResults) {

    // 1. GET and POST to collectionPlural.  Look for the correct operation of returning
    // an array of zero, one, or > 1 elements.
    return this.getMany(0, pn, priorResults)
      .then(priorResults=>{
        return this.post(this.newDocument1, pn, priorResults)
      })
      .then(priorResults=>{
        return this.getMany(1, pn, priorResults)
      })
      .then(priorResults=>{
        return this.post(this.newDocument2, pn, priorResults)
      })
      .then(priorResults=>{
        return this.getMany(2, pn, priorResults)
      })

      // 2. GET a document, using both a good and a bad id
      .then(priorResults=>{
        return this.getOne(priorResults.goodId, pn, true, priorResults) // expect success
      })
      .then(priorResults=>{
        return this.getOne('666666666666666666666666', pn, false, priorResults) // don't expect success
      })

      // We already know POST works

      // 3. PUT a document, using both a good and a bad id
      .then(priorResults=>{
        return this.put(priorResults.goodId, this.newDocument2, pn, true, priorResults) // expect success
      })
      .then(priorResults=>{
        return this.put('666666666666666666666666', this.newDocument2, pn, false, priorResults) // don't expect success
      })

      // 4. DELETE a document, using both a good and a bad id
      .then(priorResults=>{
        return this.delete(priorResults.goodId, pn, true, priorResults) // expect success
      })
      .then(priorResults=>{
        return this.delete('666666666666666666666666', pn, false, priorResults) // don't expect success
      })
  }

  /*
    1. Generic crud for transactions is ok because we can have tx
    w/o other foreign references. So it is tested elsewhere.
    
    CRUD for distributions is more complex because distributions must have
    certain foreign references such as to accounts, currencies, and transactions.

    2. We therefore must first establish two of each (so that we can test changing
     references to them.)
    
    3. Then we try to POST and PUT, using good and bad references for each.
    
    4. Finally, we have a good distribution that references accounts, currencies, and transactions.
    So now we can try to delete these items to test that referential integrity is preserved.

   */
  CRUDTest.prototype.testDistributionsCRUD = function (pn, testdata, priorResults) {

    this.collectionSingular = 'account'
    this.collectionPlural = 'accounts'
    this.newDocument1 = testdata.accountBank
    this.newDocument2 = testdata.accountCash

    // 1. POST two documents to accounts
    return this.post(this.newDocument1, pn, priorResults)
        .then(priorResults=>{
          return this.post(this.newDocument2, pn, priorResults)
        })

        // POST two documents to currencies
        .then(priorResults=>{
          this.collectionSingular = 'currency'
          this.collectionPlural = 'currencies'
          return this.post(testdata.currencyCNY, pn, priorResults)
        })
        .then(priorResults=>{
          return this.post(testdata.currencyRUB, pn, priorResults)
        })

        // POST two documents to transactions
        .then(priorResults=>{
          this.collectionSingular = 'transaction'
          this.collectionPlural = 'transactions'
          return this.post(testdata.transaction1, pn, priorResults)
        })
        .then(priorResults=>{
          return this.post(testdata.transaction2, pn, priorResults)
        })

        // POST a distribution that would ordinarily be good, except missing an account_id
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
  CRUDTest.prototype.getMany = function (expectedCnt, pn, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + this.collectionPlural
      console.log("P%s.1 GET %s", pn, url)
      this.client.get(url, function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length != expectedCnt) reject('Expecting ' + expectedCnt + ' documents, found '+ obj.length + ' documents')
        console.log("P%s.1 %j", pn, obj)
        if(obj.length > 0)
          priorResults['goodId'] = obj[0]['_id']
        resolve(priorResults)
      })
    })
  }

  // GET /{collectionPlural}/:id
  CRUDTest.prototype.getOne = function (id, pn, fExpectSuccess, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + this.collectionPlural + '/' + id
      console.log("P%s.3 GET %s", pn, url)
      this.client.get(url, function (err, req, res, obj) {
        if (err) reject(err)
        if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        console.log("P%s.3 %j", pn, obj)
        resolve(priorResults)
      })
    })
  }

  // POST /{collectionPlural}
  CRUDTest.prototype.post = function(document, pn, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + this.collectionPlural
      console.log("P%s.2 POST %s %j", pn, url, document)
      this.client.post(url, document, function (err, req, res, obj) {
        if (err) reject(err)
        if (!obj._id) reject('this test must generate an _id')
        console.log("P%s.2 %j", pn, obj)
        resolve(priorResults)
      })
    })
  }

  // PUT /{collectionPlural}/:id
  CRUDTest.prototype.put = function(id, document, pn, fExpectSuccess, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + this.collectionPlural + '/' + id
      console.log("P%s.4 PUT %s %j", pn, url, document)
      this.client.put(url, document, function (err, req, res, obj) {
        if (err) reject(err)
        if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        console.log("P%s.4 %j", pn, obj)
        resolve(priorResults)
      })
    })
  }

  // DELETE /{collectionPlural}/:id
  CRUDTest.prototype.delete = function(id, pn, fExpectSuccess, priorResults) {
    return new Promise((resolve, reject) => {
      let url = '/' + this.collectionPlural + '/' + id
      console.log("P%s.5 DELETE %s", pn, url)
      this.client.del(url, function (err, req, res, obj) {
        if (err) reject(err)
        if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        console.log("P%s.5 %j", pn, obj)
        resolve(priorResults)
      })
    })
  }

  return CRUDTest;
}

module.exports = CRUDTest();
