const bookWerxConstants = require('../../constants')

const {getMany, getOne, getOnee, post, patch} = require('../RESTOps')

// Perform a basic CRU test
const genericCRU = async ({collName, httpClient, newDoc1, newDoc2, pn}) => {
  let priorResults = {}

  // 1. Now read the documents collection and post new documents and demonstrate that we correctly have 0, 1, or 2 documents in the collection.

  // Do we have 0 documents now?
  await getMany({collName, expectedCnt: 0, expectedError: undefined, fExpectSuccess: true, httpClient, pn, priorResults})

  // Add one new document
  await post({collName, document: newDoc1, expectedError: undefined, fExpectSuccess: true, httpClient, pn, priorResults})

  // Do we have 1 document now?
  await getMany({collName, expectedCnt: 1, expectedError: undefined, fExpectSuccess: true, httpClient, pn, priorResults})

  // Add a 2nd new document.
  await post({collName, document: newDoc2, expectedError: undefined, fExpectSuccess: true, httpClient, pn, priorResults})

  // Do we have two documents now?
  await getMany({collName, expectedCnt: 2, expectedError: undefined, fExpectSuccess: true, httpClient, pn, priorResults})

  // 2. GET a document, using a good an id for an existing document, a well formed id that refers to a non-existant document, and a mal-formed id
  await getOne({collName, expectedError: undefined, fExpectSuccess: true, httpClient, id: priorResults.goodId[0], pn, priorResults})

  await getOne({collName, expectedError: 'currency 666666666666666666666666 does not exist', fExpectSuccess: false, httpClient, id: '666666666666666666666666', pn, priorResults})

  await getOne({collName, expectedError: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters', fExpectSuccess: false, httpClient, id: 'catfood', pn, priorResults})

  // 3. PATCH  a document, using a good an id for an existing document, a well formed id that refers to a non-existant document, and a mal-formed id
  await patch({collName, document: newDoc2, expectedError: undefined, fExpectSuccess: true, httpClient, id: priorResults.goodId[0], pn, priorResults})

  await patch({collName, document: newDoc2, expectedError: bookWerxConstants.ATTEMPTED_IMPLICIT_CREATE, fExpectSuccess: false, httpClient, id: '666666666666666666666666', pn, priorResults})

  await patch({collName, document: newDoc2, expectedError: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters', fExpectSuccess: false, httpClient, id: 'catfood', pn, priorResults})
}

module.exports = genericCRU
