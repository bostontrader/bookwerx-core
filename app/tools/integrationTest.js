// const ToolsTest = function (client, testdata) {
// this.client = client
// this.testdata = testdata
// }

// ToolsTest.prototype.testRunner = function (pn, priorResults) {

// return new Promise((resolve, reject) => {
// const url = '/' + collectionPlural
// console.log('P%s.2 PUT /brainwipe', pn)
// this.client.put('/brainwipe', {}, (err, req, res, obj) => {
// if (err) reject(err)
// resolve(priorResults)
// })
// })

// }

// POST /{collectionPlural}
// ToolsTest.prototype.post = function (document, collectionPlural, pn, fExpectSuccess, priorResults) {
// console.log(137, document)
// return new Promise((resolve, reject) => {
// const url = '/' + collectionPlural
// console.log('P%s.2 POST %s %j', pn, url, document)
// this.client.post(url, document, function (err, req, res, obj) {
// if (err) reject(err)
// if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
// if (fExpectSuccess && !obj._id) reject('this test must generate an _id')
// console.log('P%s.2 %j', pn, obj)
// if (fExpectSuccess) priorResults[collectionPlural].push(obj)
// resolve(priorResults)
// })
// })
// }

// export default ToolsTest
