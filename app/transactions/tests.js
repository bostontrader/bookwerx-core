let client

let firstNewTransaction = {datetime: '2016-08-04 12:00:00', note: 'first new note'}
let secondNewTransaction = {datetime: '2016-08-05 13:00:00', note: 'second new note'}

exports.setClient = function (c) { client = c }

exports.tests = function () {
  // 1. GET /transactions and look for the correct operation of returning
  // an array of zero, one, or > 1 elements.
  return new Promise((resolve, reject) => {
    console.log('GET /transactions, sb empty')
    client.get('/transactions', function (err, req, res, obj) {
      if (err) reject(err)
      if (obj.length !== 0) reject('transactions should be empty')
      console.log('transactions=%j', obj)
      resolve(true)
    })
  })

  .then((result) => {
    console.log('POST /transactions, 1st new document')
    return new Promise((resolve, reject) => {
      client.post('/transactions', firstNewTransaction, function (err, req, res, obj) {
        if (err) reject(err)
        firstNewTransaction = obj
        console.log('%j', firstNewTransaction)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /transactions, sb only 1 document')
    return new Promise((resolve, reject) => {
      client.get('/transactions', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 1) reject('transactions should only have one document')
        console.log('transactions=%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('POST /transactions, 2nd new document')
    return new Promise((resolve, reject) => {
      client.post('/transactions', secondNewTransaction, function (err, req, res, obj) {
        if (err) reject(err)
        console.log('%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /transactions, sb two documents')
    return new Promise((resolve, reject) => {
      client.get('/transactions', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 2) reject('transactions should only have two documents')
        console.log('transactions=%j', obj)
        resolve(true)
      })
    })
  })

  // 2. GET /accounts/:id
  .then((result) => {
    console.log('GET /transactions/:id, bad id')
    return new Promise((resolve, reject) => {
      client.get('/transactions/666666b816070328224cf098', function (err, req, res, obj) {
        if (err) reject(err)
        if (!obj.error) reject('this test must generate an error')
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /transactions/:id, good id')
    return new Promise((resolve, reject) => {
      client.get('/transactions/' + firstNewTransaction._id, function (err, req, res, obj) {
        if (err) reject(err)
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // 3. POST /transactions
  // We already know that POST works.

  // 4. PUT /accounts/:id
  .then((result) => {
    console.log('PUT /transactions, good id')
    return new Promise((resolve, reject) => {
      client.put('/transactions/' + firstNewTransaction._id, {title: 'first amended title'}, function (err, req, res, obj) {
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
    console.log('PUT /transactions, bad id, good document')
    return new Promise((resolve, reject) => {
      client.put('/transactions/666666b816070328224cf098', {}, function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // 5. DELETE /accounts/:id
  .then((result) => {
    console.log('DELETE /transactions, bad id')
    return new Promise((resolve, reject) => {
      client.del('/transactions/666666b816070328224cf098', function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // delete a good document id
  .then((result) => {
    console.log('DELETE /transactions, good id')
    return new Promise((resolve, reject) => {
      client.del('/transactions/' + firstNewTransaction._id, function (err, req, res, obj) {
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
