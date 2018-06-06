module.exports = {

// These errors are for when we have an apiKey but maybe the key is wrong, maybe the signature is wrong,
// who knows.
// API_SIG_NOT_CORRECT: 'the request signature is not correct',
//  MISSING_API_KEY: 'the request should have an api key',

//  UNDEFINED_CATEGORY: 'undefined category',
//  UNDEFINED_TRANSACTION: 'undefined transaction',
//  ATTEMPTED_IMPLICIT_CREATE: 'the request tries to update a non-existing document'

  // Runtime configuration
  NO_LISTENING_PORT_DEFINED: 'No listening port defined',
  NO_CONNECTION_TO_MONGODB_DEFINED: 'No connection to mongodb defined',
  NOT_CONFIGURED_AS_TEST: 'This execution is not configured to be a test  Please set the BW_TEST env variable'
}
