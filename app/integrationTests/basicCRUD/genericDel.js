import genericDelSingle  from './genericDelSingle'
import bookWerxConstants from '../../constants'

import {del} from '../RESTOps'

/*
Perform a genericDel test on two different keys.  But first test the general absence of good keys
and the authentication function.
*/

const genericDel = function ({collName, httpClient, keys, pn}) {

  const apiKey0 = keys[0].key
  const apiKey1 = keys[1].key
  let priorResults = {}

  const delTestAuth = (apiKey) => {
    return Promise.resolve()
    .then(() => {
      return del({apiKey:undefined, collName, expectedError:bookWerxConstants.MISSING_API_KEY, fExpectSuccess:false, httpClient, id:'666666666666666666666666', requestSig:undefined, pn, priorResults})
    })
    .then(() => {
      return del({apiKey:apiKey, collName, expectedError:bookWerxConstants.API_SIG_NOT_CORRECT, fExpectSuccess:false, httpClient, id:'666666666666666666666666', requestSig:undefined, pn, priorResults})
    })
    .then(() => {
      return del({apiKey:apiKey, collName, expectedError:bookWerxConstants.API_SIG_NOT_CORRECT, fExpectSuccess:false, httpClient, id:'666666666666666666666666', requestSig:'badrequestSig', pn, priorResults})
    })
  }

  // 1. Demonstrate that apiKey and requestSig are necessary and that their omission or warts
  //    cause predictable errors.  Only do this once for one key.
  return Promise.resolve()
  .then(() => {return delTestAuth(apiKey0)})

  // 2. Now perform the actual genericDel test on two different keys.
  .then(() => {return genericDelSingle({apiKey:apiKey0, collName, httpClient, pn})})
  //.then(() => {return genericDelSingle({apiKey:apiKey1, collName, httpClient, pn})})

}

export default genericDel
