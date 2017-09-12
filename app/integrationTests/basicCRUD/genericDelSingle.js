import {getMany} from '../RESTOps'
import {del}     from '../RESTOps'

// Perform a basic CRU test for a single apiKey
const genericDelSingle = function ({apiKey, collName, httpClient, pn}) {

  let priorResults = {}

  return Promise.resolve()

  // 1. Now read the documents collection and delete existing documents for a single apiKey and demonstrate that we correctly have 2, 1, or 0 documents in the collection.  Here we only focus on the correct operation of a single apiKey.  Interference, or lack thereof, with other keys is tested elsewhere.

  // Do we have 2 documents now?
  .then( result => {
    return getMany({apiKey, collName, expectedCnt:2, expectedError:undefined, fExpectSuccess:true, httpClient, requestSig:'goodsecret', pn, priorResults})
  })

  // Delete one document
  .then(priorResults => {
    return del({apiKey, collName, expectedError:undefined,fExpectSuccess:true, httpClient, id:priorResults.goodId[0], requestSig:'goodsecret', pn, priorResults})
  })

  // Do we have 1 document now?
  .then(priorResults => {
    return getMany({apiKey, collName, expectedCnt:1, expectedError:undefined,fExpectSuccess:true, httpClient, requestSig:'goodsecret', pn, priorResults})
  })

  // Delete another document
  .then(priorResults => {
    return del({apiKey, collName, expectedError:undefined,fExpectSuccess:true, httpClient, id:priorResults.goodId[0], requestSig:'goodsecret', pn, priorResults})
  })

  // Do we have zero documents now?
  .then(priorResults => {
    return getMany({apiKey, collName, expectedCnt:0, expectedError:undefined,fExpectSuccess:true, httpClient, requestSig:'goodsecret', pn, priorResults})
  })
}

export default genericDelSingle
