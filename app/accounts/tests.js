let client

let newAccount1 = {title: 'Apples'}
let newAccount2 = {title: 'Bananas'}
let newAccount3 = {title: 'Carrots'}

exports.setClient = function (c) { client = c }

exports.tests = function () {
  // 1. GET /accounts and look for the correct operation of returning
  // an array of zero, one, or > 1 elements.
  return new Promise((resolve, reject) => {
    console.log('GET /accounts, sb empty')
    client.get('/accounts', function (err, req, res, obj) {
      if (err) reject(err)
      if (obj.length !== 0) reject('accounts should be empty')
      console.log('accounts=%j', obj)
      resolve(true)
    })
  })

  .then((result) => {
    console.log('POST /accounts, 1st new document')
    return new Promise((resolve, reject) => {
      client.post('/accounts', newAccount1, function (err, req, res, obj) {
        if (err) reject(err)
        newAccount1 = obj
        console.log('%j', newAccount1)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /accounts, sb only 1 document')
    return new Promise((resolve, reject) => {
      client.get('/accounts', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 1) reject('accounts should only have one document')
        console.log('accounts=%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('POST /accounts, 2nd new document')
    return new Promise((resolve, reject) => {
      client.post('/accounts', newAccount2, function (err, req, res, obj) {
        if (err) reject(err)
        console.log('%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /accounts, sb two documents')
    return new Promise((resolve, reject) => {
      client.get('/accounts', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 2) reject('accounts should only have two documents')
        console.log('accounts=%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('POST /accounts, 3rd new document')
    return new Promise((resolve, reject) => {
      client.post('/accounts', newAccount3, function (err, req, res, obj) {
        if (err) reject(err)
        console.log('%j', obj)
        resolve(true)
      })
    })
  })

  // 2. GET /accounts/:id
  .then((result) => {
    console.log('GET /accounts/:id, bad id')
    return new Promise((resolve, reject) => {
      client.get('/accounts/666666b816070328224cf098', function (err, req, res, obj) {
        if (err) reject(err)
        if (!obj.error) reject('this test must generate an error')
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /accounts/:id, good id')
    return new Promise((resolve, reject) => {
      client.get('/accounts/' + newAccount1._id, function (err, req, res, obj) {
        if (err) reject(err)
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // 3. GET /accounts, filter and sort
  .then((result) => {
    console.log('GET /accounts, sorted by title desc')
    return new Promise((resolve, reject) => {
      filter = {}
      sort = {}
      client.get('/accounts?sort={"title":-1}', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 3) reject('accounts should have three documents')

        // Now ensure that the documents are sorted correctly.
        let priorTitle
        for(let idx = 0; idx < obj.length; idx++) {
          let account = obj[idx]
          if(priorTitle) {
            if(priorTitle < account.title) {
              reject('the accounts are out of order')
            }
          }
          priorTitle = account.title
        }

        console.log('accounts=%j', obj)
        resolve(true)
      })
    })
  })


  // 4. POST /accounts
  // We already know that POST works.

  // 5. PUT /accounts/:id
  .then((result) => {
    console.log('PUT /accounts, good id')
    return new Promise((resolve, reject) => {
      client.put('/accounts/' + newAccount1._id, {title: 'first amended title'}, function (err, req, res, obj) {
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
    console.log('PUT /accounts, bad id')
    return new Promise((resolve, reject) => {
      client.put('/accounts/666666b816070328224cf098', {}, function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // 6. DELETE /accounts/:id
  .then((result) => {
    console.log('DELETE /accounts, bad id')
    return new Promise((resolve, reject) => {
      client.del('/accounts/666666b816070328224cf098', function (err, req, res, obj) {
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
    console.log('DELETE /accounts, good id')
    return new Promise((resolve, reject) => {
      client.del('/accounts/' + newAccount1._id, function (err, req, res, obj) {
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
