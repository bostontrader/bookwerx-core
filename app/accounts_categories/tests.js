let client

let firstNewAccountCategory = {symbol: 'A', title: 'Assets'}
let secondNewAccountCategory = {symbol: 'L', title: 'Liabilities'}

exports.setClient = function (c) { client = c }

exports.tests = function () {
  // 1. GET /accounts_categories and look for the correct operation of returning
  // an array of zero, one, or > 1 elements.
  return new Promise((resolve, reject) => {
    console.log('GET /accounts_categories, sb empty')
    client.get('/accounts_categories', function (err, req, res, obj) {
      if (err) reject(err)
      if (obj.length !== 0) reject('accounts_categories should be empty')
      console.log('accounts_categories=%j', obj)
      resolve(true)
    })
  })

  .then((result) => {
    console.log('POST /accounts_categories, 1st new document')
    return new Promise((resolve, reject) => {
      client.post('/accounts_categories', firstNewAccountCategory, function (err, req, res, obj) {
        if (err) reject(err)
        firstNewAccountCategory = obj
        console.log('%j', firstNewAccountCategory)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /accounts_categories, sb only 1 document')
    return new Promise((resolve, reject) => {
      client.get('/accounts_categories', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 1) reject('accounts_categories should only have one document')
        console.log('accounts_categories=%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('POST /accounts_categories, 2nd new document')
    return new Promise((resolve, reject) => {
      client.post('/accounts_categories', secondNewAccountCategory, function (err, req, res, obj) {
        if (err) reject(err)
        console.log('%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /accounts_categories, sb two documents')
    return new Promise((resolve, reject) => {
      client.get('/accounts_categories', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 2) reject('accounts_categories should only have two documents')
        console.log('accounts_categories=%j', obj)
        resolve(true)
      })
    })
  })

  // 2. GET /accounts_categories/:id
  .then((result) => {
    console.log('GET /accounts_categories/:id, bad id')
    return new Promise((resolve, reject) => {
      client.get('/accounts_categories/666666b816070328224cf098', function (err, req, res, obj) {
        if (err) reject(err)
        if (!obj.error) reject('this test must generate an error')
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /accounts_categories/:id, good id')
    return new Promise((resolve, reject) => {
      client.get('/accounts_categories/' + firstNewAccountCategory._id, function (err, req, res, obj) {
        if (err) reject(err)
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // 3. POST /accounts_categories
  // We already know that POST works.

  // 4. PUT /accounts_categories/:id
  .then((result) => {
    console.log('PUT /accounts_categories, good id')
    return new Promise((resolve, reject) => {
      client.put('/accounts_categories/' + firstNewAccountCategory._id, {symbol: 'BBB', title: 'first amended title'}, function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('PUT /accounts_categories, bad id')
    return new Promise((resolve, reject) => {
      client.put('/accounts_categories/666666b816070328224cf098', {}, function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // 5. DELETE /accounts_categories/:id
  .then((result) => {
    console.log('DELETE /accounts_categories, bad id')
    return new Promise((resolve, reject) => {
      client.del('/accounts_categories/666666b816070328224cf098', function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('DELETE /accounts_categories, good id')
    return new Promise((resolve, reject) => {
      client.del('/accounts_categories/' + firstNewAccountCategory._id, function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })
}
