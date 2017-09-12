import {book0} from './testdata-keyed'
import {book1} from './testdata-keyed'
//import {post} from './RESTOps'

import bookWerxConstants from '../constants'

const accountsCategories = function ({httpClient, keys, pn}) {





  // Post all elements in a collection to the given collection
  //const postMany = ({apiKey, collName, document, httpClient, pn, priorResults}) => {
    //const p = post({apiKey, collName, document, expectedError:undefined,fExpectSuccess:true, httpClient, //requestSig:'goodsecret', pn, priorResults})
   // promiseStack.push(p)
   // console.log(11, document)
  //}

  // Post all collections in a book
  //const postBook = ({book, apiKey}) => {
    // for each account in book A, post
    //book.accounts.forEach( (account) => {postMany({apiKey, collName:'accounts', document:account, httpClient, pn, priorResults})})

    // for each category in book A, post
    //book.categories.forEach( (category) => {postMany({apiKey, collName:'categories', document:category, httpClient, pn, priorResults})})

    // for each currency in book A, post
    //book.currencies.forEach( (currency) => {postMany({apiKey, collName:'currencies', document:currency, httpClient, pn, priorResults})})

    // for each transaction in book A, post
    //book.transactions.forEach( (transaction) => {postMany({apiKey, collName:'transactions', document:transaction, httpClient, pn, priorResults})})
  //}

  //const promiseStack = []
  //const priorResults = {}

  //postBook({book: book0, apiKey:'a'})
  //postBook({book: book1, apiKey:'b'})


  //return Promise.resolve()
  //.then(()=>{
    //return Promise.all(promiseStack)
  //})

  //This is POST testing.

  //.then(() => {
    //post a new account with a bad category.  fail.
    //return post({apiKey:'a', collName:'accounts', document:{'title':'catfood','categories':['badcat']}, expectedError:undefined,fExpectSuccess:bookWerxConstants.UNDEFINED_CATEGORY, httpClient, requestSig:'goodsecret', pn, priorResults})
 // })
  //.then((result) =>{
    //console.log(54,result)
  //})









  /*post a new account with a real category from another key.  fail.  no such category. don't tell 'em it exists.

  do the same for categories

  post a new account with one good category.  verify
   the account only has one category
   that the catgory only has this tx.

  post a new account with two good categories. verify
    the account has two categories and its these two
    each category refers to only one tx and its this one

  do the same the same for categories.  but do we really want to ? maybe let's wait until we have this actual problem.


  Now do put testing. put does update not replace

  1. put to account with two good categories.
    verify categories and transactions point to each other.

  2. put to account with one good and one bad tx.
    bad tx is ignored.
    verify categories and tx point to each other.

  3. put to account with one good category and onother good category from another key.  pretend the other cat is simply bad.

  4 put to account with empty categories.
    verify that the former categories no longer point here.




 */






  /*

Accounts and Categories have a many-to-many relationship.  An account document contains an array of category references and a category document maintains an array of account references.  No account has more than a handful of categories and it's hard to imagine a category with too many accounts.

Basic CRUD testing for both Accounts and Categories is done elsewhere so we assume that part works.  In this test we'll
Here's how we'll try to test this...

1. Setup test fixture


2. POST.  This only makes new documents.  Cannot update existing one.


1. post account with bad category. fail.
  // Add one new document
  .then(priorResults => {
    return post({apiKey, collName, document:newDoc1, expectedError:undefined,fExpectSuccess:true, httpClient, requestSig:'goodsecret', pn, priorResults})
  })


2. post account with 1 good category. success.

2.a. read categories 1st time
2.b. post account
2.c. read account.  verify that it contains all categories.
read categories 2nd time. verify exactly the same except for one new account.

  // 2.a. Add one new document
  .then(priorResults => {
    return post({apiKey, collName, document:newDoc1, expectedError:undefined,fExpectSuccess:true, httpClient, requestSig:'goodsecret', pn, priorResults})
  })




3. post account with 2 good categories.  success.
read categories 1st time
post account
read account.  verify that it contains all categories.
read categories 2nd time. verify exactly the same execpt for one new account.


4. post category with bad account. fail.

5. post category with 1 good account.  success.
read accounts 1st time
post category
read accounts 2nd time. verify exactly the same except for one new category.

6. post category with 2 good accounts. success.
read accounts 1st time
post category
read accounts 2nd time. verify exactly the same except for one new category.


2. PUT. This lets us update exsiting documents.

1. put account with bad category. fail.

2. put account with 1 good category. success.
read categories 1st time
put account
read categories 2nd time. verify exactly the same except for one new account.

3. put account with 2 good categories.  success.
read categories 1st time
put account
read categories 2nd time. verify exactly the same execpt for one new account.


4. put category with bad account. fail.

5. put category with 1 good account.  success.
read accounts 1st time
put category
read accounts 2nd time. verify exactly the same except for one new category.

6. put category with 2 good accounts. success.
read accounts 1st time
put category
read accounts 2nd time. verify exactly the same except for one new category.




   Testing for accounts_categories is more complex because accounts_categories must have
   foreign references to accounts and categories.

  Delete a category that has



   1. Brainwipe

   2.1 POST /categories categoryAsset
   2.2 POST /categories categoryAssetLiquid
   2.3 POST /categories categoryExpense
   2.4 POST /categories categoryExpenseRent

   3.1 POST /accounts accountsBank, pointing to no categories
   3.2 GET /accounts/:accountsBank. Verify that the account's categories and accounts_categories is an empty array.
   3.3 PUT /accounts accountsBank, pointing to categoryExpense
   3.4 GET /accounts/:accountsBank. Verify that the account points to categoryExpense.

   4.1 PUT /accounts accountsBank, pointing to categoryAsset and categoryLiquid.
   4.2 GET /accounts/:accountsBank. Verify that the account points to categoryAsset and categoryLiquid.

   5.1 PUT /accounts accountsExpenseRent, pointing to categoryExpense and categoryExpenseRent.
   5.2 GET /accounts/:accountsExpenseRent. Verify that the account points to categoryExpense and categoryExpenseRent.

   6. GET /accounts.  Verify that each account has two account_category.

   Post A1 with C1
               | A1 | A2 |
   A1       |  x   |      |
   A2 |      |      |
  



  */
  //AccountsCategoriesTest.prototype.testRunner = function (pn, testdata) {
    // Phase I Setup
    //let collectionPlural
    //let priorResults = {}

    // 1. Brainwipe
    //return new Promise((resolve, reject) => {
      //let url = '/brainwipe'
      //console.log('P%s.6 PUT %s', pn, url)
      //this.client.put(url, function (err, req, res, obj) {
        //if (err) reject(err)
        //console.log('P%s.9 %j', pn, obj)
        //resolve(priorResults)
      //})
    //})

    // 2. POST four documents to categories
    //.then(priorResults => {
      //collectionPlural = 'categories'
      //priorResults[collectionPlural] = {}
      //return this.post(testdata.categoryAsset, collectionPlural, pn, true, priorResults, 'categoryAsset') // expect success
    //})

    //.then(priorResults => {
      //return this.post(testdata.categoryAssetLiquid, collectionPlural, pn, true, priorResults, 'categoryAssetLiquid') // expect success
    //})

    //.then(priorResults => {
      //return this.post(testdata.categoryExpense, collectionPlural, pn, true, priorResults, 'categoryExpense') // expect success
    //})

    //.then(priorResults => {
      //return this.post(testdata.categoryExpenseRent, collectionPlural, pn, true, priorResults, 'categoryExpenseRent') // expect success
    //})

    // 3.1 POST /accounts accountsBank, pointing to no categories
    //.then(priorResults => {
      //collectionPlural = 'accounts'
      //priorResults[collectionPlural] = {}
      //let account = JSON.parse(JSON.stringify(testdata.accountBank))
      //return this.post(account, collectionPlural, pn, true, priorResults, 'accountBank') // expect success
    //})
    // 3.2 GET /accounts/:accountsBank. Verify that the account's accounts_categories is an empty array.
    //.then(priorResults => {
      //let accountId = priorResults.accounts.accountBank._id
      //return this.getOne(accountId, collectionPlural, pn, true, priorResults, 'accountBank') // expect success
    //})
    //.then(priorResults => {
      //return new Promise((resolve, reject) => {
        //let account = priorResults.accounts.accountBank
        //if (account.accounts_categories) {
          //if (account.accounts_categories.length > 0) {
            //reject('account should not have any accounts_categories')
          //} else {
            //resolve(priorResults)
          //}
        //} else {
          //resolve(priorResults)
        //}
      //})
    //})

    // 3.3 PUT /accounts accountsBank, pointing to categoryExpense
    //.then(priorResults => {
      //let account = priorResults.accounts.accountBank
      //let accountId = account._id
      //delete account._id
      //account.categories = [priorResults.categories.categoryExpense._id]
      //return this.put(accountId, account, collectionPlural, pn, true, priorResults, 'accountBank') // expect success
    //})

    // 3.4 GET /accounts/:accountsBank. Verify that the account points to categoryExpense.
    //.then(priorResults => {
      //let accountId = priorResults.accounts.accountBank._id
      //return this.getOne(accountId, collectionPlural, pn, true, priorResults, 'accountBank') // expect success
    //})

    //.then(priorResults => {
      //return new Promise((resolve, reject) => {
        //let account = priorResults.accounts.accountBank
        //if (account.categories) {
          //if (account.categories.length !== 1) {
            //reject('account should only have one category')
          //} else {
            //resolve(priorResults)
          //}
        //} else {
          //reject('account should have one category')
        //}
      //})
    //})

    // 4.1 PUT /accounts accountsBank, pointing to categoryAsset and categoryLiquid.
    // 4.2 GET /accounts/:accountsBank. Verify that the account points to categoryAsset and categoryLiquid.

    // 5.1 PUT /accounts accountsExpenseRent, pointing to categoryExpense and categoryExpenseRent.
    // 5.2 GET /accounts/:accountsExpenseRent. Verify that the account points to categoryExpense and categoryExpenseRent.

    // 6. GET /accounts.  Verify that each account has two account_category.

    // 7.1 DELETE /accounts/:accountsExpenseRent.
    // 7.2 Verify that accounts_categories no longer has any documents pointing to accountsExpenseRent.
  //}

  // GET /{collectionPlural}/:account_category_id
  //AccountsCategoriesTest.prototype.getOne = function (accountsCategoriesId, collectionPlural, pn, fExpectSuccess, priorResults, prKey) {
    //return new Promise((resolve, reject) => {
      //let url = '/' + collectionPlural + '/' + accountsCategoriesId
      //console.log('P%s.3 GET %s', pn, url)
      //this.client.get(url, function (err, req, res, obj) {
        //if (err) reject(err)
        //if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        //if (fExpectSuccess && !obj._id) reject('this test must return an _id')
        //console.log('P%s.3 %j', pn, obj)
        //resolve(priorResults)
        //if (prKey) {
          //priorResults[collectionPlural][prKey] = obj
        //}
        //priorResults.mostRecentResult = obj
      //})
    //})
  //}

  // POST /{collectionPlural}
  //AccountsCategoriesTest.prototype.post = function (document, collectionPlural, pn, fExpectSuccess, priorResults, prKey) {
    //return new Promise((resolve, reject) => {
      //let url = '/' + collectionPlural
      //console.log('P%s.2 POST %s %j', pn, url, document)
      //this.client.post(url, document, function (err, req, res, obj) {
        //if (err) reject(err)
        //if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        //if (fExpectSuccess && !obj._id) reject('this test must generate an _id')
        //console.log('P%s.2 %j', pn, obj)
        //if (prKey) {
          //priorResults[collectionPlural][prKey] = obj
        //}
        //priorResults.mostRecentResult = obj
        //resolve(priorResults)
      //})
    //})
  //}

  // PUT /{collectionPlural}/:account_category_id
  // We cannot rely on the document to contain the account_category_id.  So therefore send the id seperately.
 // AccountsCategoriesTest.prototype.put = function (accountsCategoriesId, document, collectionPlural, pn, //fExpectSuccess, priorResults, prKey) {
    //return new Promise((resolve, reject) => {
      //let url = '/' + collectionPlural + '/' + accountsCategoriesId
      //console.log('P%s.4 PUT %s %j', pn, url, document)
      //this.client.put(url, document, function (err, req, res, obj) {
        //if (err) reject(err)
        //if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        //if (fExpectSuccess && !obj._id) reject('this test must generate an _id')
        //console.log('P%s.4 %j', pn, obj)
        //if (prKey) {
          //priorResults[collectionPlural][prKey] = obj
       // }
        //priorResults.mostRecentResult = obj
        //resolve(priorResults)
      //})
    //})
  //}

  // DELETE /{collectionPlural}/:id
  //AccountsCategoriesTest.prototype.delete = function (id, collectionPlural, pn, fExpectSuccess, priorResults) {
    //return new Promise((resolve, reject) => {
      //let url = '/' + collectionPlural + '/' + id
      //console.log('P%s.5 DELETE %s', pn, url)
      //this.client.del(url, function (err, req, res, obj) {
        //if (err) reject(err)
        //if (!fExpectSuccess && !obj.error) reject('this test must generate an error')
        //console.log('P%s.5 %j', pn, obj)
        //resolve(priorResults)
      //})
    //})
  //}

  //return AccountsCategoriesTest
//}

  return Promise.resolve()


}

export default accountsCategories
