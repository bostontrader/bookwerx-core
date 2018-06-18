const {del, getMany} = require('../RESTOps')

const genericDel = async ({collName, httpClient, pn}) => {
  let priorResults = {}

  // 1. Read the document's collection and delete existing documents and demonstrate that we correctly have 2, 1, or 0 documents in the collection.

  // Do we have 2 documents now?
  await getMany({collName, expectedCnt: 2, expectedError: undefined, fExpectSuccess: true, httpClient, pn, priorResults})

  // Delete one document
  await del({collName, expectedError: undefined, fExpectSuccess: true, httpClient, id: priorResults.goodId[0], pn, priorResults})

  // Do we have 1 document now?
  await getMany({collName, expectedCnt: 1, expectedError: undefined, fExpectSuccess: true, httpClient, pn, priorResults})

  // Delete another document
  await del({collName, expectedError: undefined, fExpectSuccess: true, httpClient, id: priorResults.goodId[0], pn, priorResults})

  // Do we have zero documents now?
  await getMany({collName, expectedCnt: 0, expectedError: undefined, fExpectSuccess: true, httpClient, pn, priorResults})
}

module.exports = genericDel
