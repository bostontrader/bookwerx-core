const bookWerxConstants = {

  // These errors are for when we have an apiKey but maybe the key is wrong, maybe the signature is wrong,
  // who knows.
  API_SIG_NOT_CORRECT: 'the request signature is not correct',
  MISSING_API_KEY: 'the request should have an api key',

  UNDEFINED_CATEGORY: 'undefined category',
  UNDEFINED_TRANSACTION: 'undefined transaction',
  ATTEMPTED_IMPLICIT_CREATE: 'the request tries to update a non-existing document'
}

export default bookWerxConstants
