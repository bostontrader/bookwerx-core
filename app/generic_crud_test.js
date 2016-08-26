/*
Most collections, such as accounts, categories, currencies, and transactions need identical
CRUD testing.  This class provides that capability.

Distributions and accounts_categories have unique referential contraints and are not
so interested in CRUD. Hence, test them elsewhere.
 */

let CRUDTest = function () {
  function CRUDTest (c, cs, cp, nd1, nd2) {
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
      .then(priorResults => {
        return this.post(this.newDocument1, pn, true, priorResults) // expect success
      })
      .then(priorResults => {
        return this.getMany(1, pn, priorResults)
      })
      .then(priorResults => {
        return this.post(this.newDocument2, pn, true, priorResults) // expect success
      })
      .then(priorResults => {
        return this.getMany(2, pn, priorResults)
      })

      // 2. GET a document, using both a good and a bad id
      .then(priorResults => {
        return this.getOne(priorResults.goodId, pn, true, priorResults) // expect success
      })
      .then(priorResults => {
        return this.getOne('666666666666666666666666', pn, false, priorResults) // don't expect success
      })

      // We already know POST works

      // 3. PUT a document, using both a good and a bad id
      .then(priorResults => {
        return this.put(priorResults.goodId, this.newDocument2, pn, true, priorResults) // expect success
      })
      .then(priorResults => {
        return this.put('666666666666666666666666', this.newDocument2, pn, false, priorResults) // don't expect success
      })

      // 4. DELETE a document, using both a good and a bad id
      .then(priorResults => {
        return this.delete(priorResults.goodId, pn, true, priorResults) // expect success
      })
      .then(priorResults => {
        return this.delete('666666666666666666666666', pn, false, priorResults) // don't expect success
      })
  }

  // GET /{collectionPlural} and look for the correct operation of returning
  // the correct number of array elements.
  CRUDTest.prototype.getMany = function (expectedCnt, pn, priorResults) {
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
  }

  // GET /{collectionPlural}/:id
  CRUDTest.prototype.getOne = function (id, pn, fExpectSuccess, priorResults) {
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
  }

  // POST /{collectionPlural}
  CRUDTest.prototype.post = function (document, pn, fExpectSuccess, priorResults) {
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
  CRUDTest.prototype.put = function (id, document, pn, fExpectSuccess, priorResults) {
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
  }

  // DELETE /{collectionPlural}/:id
  CRUDTest.prototype.delete = function (id, pn, fExpectSuccess, priorResults) {
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

  return CRUDTest
}

module.exports = CRUDTest()
