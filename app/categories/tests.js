let client

let firstNewCategory = {symbol: 'A', title: 'Assets'}
let secondNewCategory = {symbol: 'L', title: 'Liabilities'}

exports.setClient = function (c) { client = c }

exports.tests = function () {
  // 1. GET /categories and look for the correct operation of returning
  // an array of zero, one, or > 1 elements.
  return new Promise((resolve, reject) => {
    console.log('GET /categories, sb empty')
    client.get('/categories', function (err, req, res, obj) {
      if (err) reject(err)
      if (obj.length !== 0) reject('categories should be empty')
      console.log('categories=%j', obj)
      resolve(true)
    })
  })

  .then((result) => {
    console.log('POST /categories, 1st new document')
    return new Promise((resolve, reject) => {
      client.post('/categories', firstNewCategory, function (err, req, res, obj) {
        if (err) reject(err)
        firstNewCategory = obj
        console.log('%j', firstNewCategory)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /categories, sb only 1 document')
    return new Promise((resolve, reject) => {
      client.get('/categories', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 1) reject('categories should only have one document')
        console.log('categories=%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('POST /categories, 2nd new document')
    return new Promise((resolve, reject) => {
      client.post('/categories', secondNewCategory, function (err, req, res, obj) {
        if (err) reject(err)
        console.log('%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /categories, sb two documents')
    return new Promise((resolve, reject) => {
      client.get('/categories', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 2) reject('categories should only have two documents')
        console.log('categories=%j', obj)
        resolve(true)
      })
    })
  })

  // 2. GET /categories/:id
  .then((result) => {
    console.log('GET /categories/:id, bad id')
    return new Promise((resolve, reject) => {
      client.get('/categories/666666b816070328224cf098', function (err, req, res, obj) {
        if (err) reject(err)
        if (!obj.error) reject('this test must generate an error')
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /categories/:id, good id')
    return new Promise((resolve, reject) => {
      client.get('/categories/' + firstNewCategory._id, function (err, req, res, obj) {
        if (err) reject(err)
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // 3. POST /categories
  // We already know that POST works.

  // 4. PUT /categories/:id
  .then((result) => {
    console.log('PUT /categories, good id')
    return new Promise((resolve, reject) => {
      client.put('/categories/' + firstNewCategory._id, {symbol: 'BBB', title: 'first amended title'}, function (err, req, res, obj) {
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
    console.log('PUT /categories, bad id')
    return new Promise((resolve, reject) => {
      client.put('/categories/666666b816070328224cf098', {}, function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // 5. DELETE /categories/:id
  .then((result) => {
    console.log('DELETE /categories, bad id')
    return new Promise((resolve, reject) => {
      client.del('/categories/666666b816070328224cf098', function (err, req, res, obj) {
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
    console.log('DELETE /categories, good id')
    return new Promise((resolve, reject) => {
      client.del('/categories/' + firstNewCategory._id, function (err, req, res, obj) {
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
