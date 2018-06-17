// We need to use require
// import bookWerxConstants from "../../constants";

// import {getMany} from '../RESTOps'
const {getMany} = require('../RESTOps')

// import {getOne}  from '../RESTOps'
const {getOne} = require('../RESTOps')

// import {post}    from '../RESTOps'
const {post} = require('../RESTOps')

// import {put}     from '../RESTOps'

// Perform a basic CRU test for a single apiKey
module.exports = async ({apiKey, collName, httpClient, newDoc1, newDoc2, pn}) => {
  let priorResults = {}

  // return Promise.resolve()

  // 1. Now read the documents collection and post new documents for a single apiKey and demonstrate that we correctly have 0, 1, or 2 documents in the collection.  Here we only focus on the correct operation of a single apiKey.  Interference, or lack thereof, with other keys is tested elsewhere.

  // Do we have 0 documents now?
  // .then(() => {
  // return getMany({apiKey, collName, expectedCnt:0, expectedError:undefined, fExpectSuccess:true, httpClient, requestSig:'goodsecret', pn, priorResults})
  // })
  await getMany({apiKey, collName, expectedCnt: 0, expectedError: undefined, fExpectSuccess: true, httpClient, requestSig: 'goodsecret', pn, priorResults})

  // Add one new document
  // .then(priorResults => {
  // return post({apiKey, collName, document:newDoc1, expectedError:undefined,fExpectSuccess:true, httpClient, requestSig:'goodsecret', pn, priorResults})
  // })
  await post({apiKey, collName, document: newDoc1, expectedError: undefined, fExpectSuccess: true, httpClient, requestSig: 'goodsecret', pn, priorResults})
  // Do we have 1 document now?
  // .then(priorResults => {
  // return getMany({apiKey, collName, expectedCnt:1, expectedError:undefined,fExpectSuccess:true, httpClient, requestSig:'goodsecret', pn, priorResults})
  // })
  await getMany({apiKey, collName, expectedCnt: 1, expectedError: undefined, fExpectSuccess: true, httpClient, requestSig: 'goodsecret', pn, priorResults})
  // })

  // Add a 2nd new document.
  // .then(priorResults => {
  // return post({apiKey, collName, document:newDoc2, expectedError:undefined,fExpectSuccess:true, httpClient, requestSig:'goodsecret', pn, priorResults})
  // })
  await post({apiKey, collName, document: newDoc2, expectedError: undefined, fExpectSuccess: true, httpClient, requestSig: 'goodsecret', pn, priorResults})
  // })

  // Do we have two documents now?
  // .then(priorResults => {
  // return getMany({apiKey, collName, expectedCnt:2, expectedError:undefined,fExpectSuccess:true, httpClient, requestSig:'goodsecret', pn, priorResults})
  // })
  await getMany({apiKey, collName, expectedCnt: 2, expectedError: undefined, fExpectSuccess: true, httpClient, requestSig: 'goodsecret', pn, priorResults})
  // })

  // 3. GET a document, using both a good and a bad id
  // .then(priorResults => {
  // return getOne({apiKey, collName, expectedError:undefined, fExpectSuccess:true, httpClient, id:priorResults.goodId[0], requestSig:'goodsecret', pn, priorResults})
  // })
  await getOne({apiKey, collName, expectedError: undefined, fExpectSuccess: true, httpClient, id: priorResults.goodId[0], requestSig: 'goodsecret', pn, priorResults})
  // })
  // .then(priorResults => {
  // return getOne({apiKey, collName, expectedError:undefined, fExpectSuccess:true, httpClient, id:'666666666666666666666666', requestSig:'goodsecret', pn, priorResults})
  // })
  await getOne({apiKey, collName, expectedError: undefined, fExpectSuccess: true, httpClient, id: '666666666666666666666666', requestSig: 'goodsecret', pn, priorResults})
  // })
  // 4. PUT a document, using both a good and a bad id
  // .then(priorResults => {
  // newDoc2.t = 'tom'
  // return put({apiKey, collName, document:newDoc2, expectedError:undefined,fExpectSuccess:true, httpClient, id:priorResults.goodId[0], requestSig:'goodsecret', pn, priorResults})
  // })
  // .then(priorResults => {
  // return put({apiKey, collName, document:newDoc2, expectedError:bookWerxConstants.ATTEMPTED_IMPLICIT_CREATE,fExpectSuccess:false, httpClient, id:'666666666666666666666666', requestSig:'goodsecret', pn, priorResults})
  // })
}

// export default genericCRUSingle
