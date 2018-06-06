// import genericCRUSingle  from './genericCRUSingle'
const genericCRUSingle = require('./genericCRUSingle.js')
// import bookWerxConstants from '../../constants'
// const bookWerxConstants = require('../../constants')

// import {getMany} from '../RESTOps'
// import {getOne}  from '../RESTOps'
// import {post}    from '../RESTOps'
// import {put}     from '../RESTOps'
// const {getMany /*, getOne, post, put */ } = require('../RESTOps.js')

/*
Perform a genericCRU test on two different keys.  But first test the general absence of good keys
and the authentication function.
*/

const genericCRU = async ({collName, httpClient, keys, newDoc1, newDoc2, pn}) => {
  // const apiKey0 = keys[0].key
  const apiKey1 = keys[1].key
  // let priorResults = {}

  // These functions will invoke the basic HTTP function with various combinations
  // of good and bad apiKey and requestSig.  After we know this part works correctly, we don't
  // need to pollute the rest of the testing with probing the auth part.
  /* const getManyTestAuth = (apiKey) => {
      return Promise.resolve()
        .then(() => {
          return getMany({ apiKey: undefined, collName, expectedCnt: 0, expectedError: bookWerxConstants.MISSING_API_KEY, fExpectSuccess: false, httpClient, requestSig: undefined, pn, priorResults })
      })
      .then(() => {
        return getMany({apiKey, collName, expectedCnt: 0, expectedError: bookWerxConstants.API_SIG_NOT_CORRECT, fExpectSuccess: false, httpClient, requestSig: undefined, pn, priorResults})
      })
      .then(() => {
        return getMany({apiKey, collName, expectedCnt: 0, expectedError: bookWerxConstants.API_SIG_NOT_CORRECT, fExpectSuccess: false, httpClient, requestSig: 'badrequestSig', pn, priorResults})
      })
    } */

  /* const getOneTestAuth = (apiKey) => {
      return Promise.resolve()
      .then(() => {
        return getOne({apiKey:undefined, collName, expectedError:bookWerxConstants.MISSING_API_KEY, fExpectSuccess:false, httpClient, id:'666666666666666666666666', requestSig:undefined, pn, priorResults})
      })
      .then(() => {
        return getOne({apiKey, collName, expectedError:bookWerxConstants.API_SIG_NOT_CORRECT, fExpectSuccess:false, httpClient, id:'666666666666666666666666', requestSig:undefined, pn, priorResults})
      })
      .then(() => {
        return getOne({apiKey, collName, expectedError:bookWerxConstants.API_SIG_NOT_CORRECT, fExpectSuccess:false, httpClient, id:'666666666666666666666666', requestSig:'badrequestSig', pn, priorResults})
      })
    }

    const postTestAuth = (apiKey) => {
      return Promise.resolve()
      .then(() => {
        return post({apiKey:undefined, collName, document:{}, expectedError:bookWerxConstants.MISSING_API_KEY, fExpectSuccess:false, httpClient, requestSig:undefined, pn, priorResults})
      })
      .then(() => {
        return post({apiKey, collName, document:{}, expectedError:bookWerxConstants.API_SIG_NOT_CORRECT, fExpectSuccess:false, httpClient, requestSig:undefined, pn, priorResults})
      })
      .then(() => {
        return post({apiKey, collName, document:{}, expectedError:bookWerxConstants.API_SIG_NOT_CORRECT, fExpectSuccess:false, httpClient, requestSig:'badrequestSig', pn, priorResults})
      })
    }

    const putTestAuth = (apiKey) => {
      return Promise.resolve()
      .then(() => {
        return put({apiKey:undefined, collName, document:{}, expectedError:bookWerxConstants.MISSING_API_KEY, fExpectSuccess:false, httpClient, id:'666666666666666666666666', requestSig:undefined, pn, priorResults})
      })
      .then(() => {
        return put({apiKey, collName, document:{}, expectedError:bookWerxConstants.API_SIG_NOT_CORRECT, fExpectSuccess:false, httpClient, id:'666666666666666666666666', requestSig:undefined, pn, priorResults})
      })
      .then(() => {
        return put({apiKey, collName, document:{}, expectedError:bookWerxConstants.API_SIG_NOT_CORRECT, fExpectSuccess:false, httpClient, id:'666666666666666666666666', requestSig:'badrequestSig', pn, priorResults})
      })
    }

    // 1. Demonstrate that apiKey and requestSig are necessary and that their omission or warts
    //    cause predictable errors.  Only do this once for one key.
    return Promise.resolve()
    .then(() => {return getManyTestAuth(apiKey0)})
    .then(() => {return getOneTestAuth(apiKey0)})
    .then(() => {return postTestAuth(apiKey0)})
    .then(() => {return putTestAuth(apiKey0)}) */

  // 3. Now perform the actual genericCRU twice, using two different keys.
  // .then(() => {return genericCRUSingle({apiKey:apiKey0, collName, httpClient, newDoc1, newDoc2, pn})})
  // .then(() => {return genericCRUSingle({apiKey:apiKey1, collName, httpClient, newDoc1, newDoc2, pn})})
  return genericCRUSingle({apiKey: apiKey1, collName, httpClient, newDoc1, newDoc2, pn})
}
// export default genericCRU
module.exports = genericCRU
