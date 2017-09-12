//import bookWerxConstants from './constants'

/*
Most requests should have an apiKey and a requestSig.
*/
//const authThenInvoke = (req, res) => {
  //const pMustHaveKey = new Promise((resolve, reject) => {
    //if('apiKey' in req.query) {
      //if('requestSig' in req.query) {
        //if(req.query.requestSig === 'goodsecret') { // if the signature is correct
          // The signature is good so now do the main action
          //return coreQuery(req.query.apiKey)
            //.then(result => {
              //res.json(result)
            //})
        //} else {
          //resolve({error: bookWerxConstants.API_SIG_NOT_CORRECT})
        //}
      //} else {
        //resolve({error: bookWerxConstants.API_SIG_NOT_CORRECT})
      //}
    //} else {
      //resolve({error: bookWerxConstants.MISSING_API_KEY})
    //}
  //})
  //pMustHaveKey.then( result => {
    //res.json(result)
  //})

  //pMustHaveKey.catch(error => {
    //console.log(74, error)
  //})

  //return pMustHaveKey
//}

//export default authThenInvoke
