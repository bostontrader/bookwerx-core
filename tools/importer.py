#
# The purpose of this script is to provide an example of importing old data
# into bookwerx-core. This example illustrates a few important issues:
#
# 1. This script populates the bookwerx-core db soley by use of the bookwerx-core
# public API.
#
# 2. This script takes a file of JSON containing denormalized data as its
# input.
#
# 3. This script makes synchronous calls to the API. In fact, Python was
# chosen for this task _because_ of its synchronous nature.  bookwerx-core
# is Javascript and it was tempting to write this example using JS.  However,
# contorting JS, asynchronicity, and promises to fit into a while-loop
# proved to be remarkably difficult.  Which leads me to...
#
# 4. This is a throw-away script and thus software quality ideals should be
# adjusted to fit.  The astute reader will readily notice areas of improvement
# and are invited to implement said improvements at their leisure.
#
# 5. Some of the apparent inefficiencies are due to the desire to avoid putting
# extraneous "old" information into the new db.  For example, if we don't put
# the old account id into the new db, how can we efficiently search the new
# db for the existence of said account?  This may or may not be a problem, depending
# upon your particular scale.
#

import requests
import json

# Given a symbol and title:
# 1. Retrieve the document in the currencies collection, if any, with the
# given symbol...
# 2. If no document matches above, create a new document, using symbol and title...
# 3. Return the _id of the existing or newly created document.
#
def getCurrencyId(symbol,title):

  currencies_collection = requests.get('http://localhost:3003/currencies')
  currency_id=""
  for currency in json.loads(currencies_collection.text):
    # If symbol is present in this collection, then grab the currency_id
    if currency['symbol'] == symbol:
      currency_id=currency['_id']
      break

  # If the currency is not found then post a new currency
  if currency_id=="":
    post_resp = requests.post('http://localhost:3003/currencies',
      headers={'Content-type': 'application/json'},
      data = json.dumps({'symbol':symbol,'title':title}))
    currency_id=json.loads(post_resp.text)['_id']

  # and then return the existing or new currency_id
  return currency_id

# Given a title:
# 1. Retrieve the document in the accounts collection, if any, with the
# given title...
# 2. If no document matches above, create a new document, using the title...
# 3. Return the _id of the existing or newly created document.
#
def getAccountId(title):

  accounts_collection = requests.get('http://localhost:3003/accounts')
  account_id=""
  for account in json.loads(accounts_collection.text):
    # If title is present in this collection, then grab the account_id
    if account['title'] == title:
      return account['_id']

  # If the account is not found then post a new account
  if account_id=="":
    post_resp = requests.post('http://localhost:3003/accounts',
      headers={'Content-type': 'application/json'},
      data = json.dumps({'title':title}))
    account_id=json.loads(post_resp.text)['_id']

    # and then return the existing or new account_id
    return account_id

transaction_dictionary={}

#
# Given the old transaction_id, tran_datetime and note:
# 1. Retrieve the document in the transactions collection, if any, that uniquely "matches"
# 2. If no document matches above, create a new document, using the supplied info
# 3. Return the _id of the existing or newly created document.
# Note: This method builds a dictionary associating the old transaction_id with the new.
#
def getTransactionId(old_transaction_id, tran_datetime, note):

  if old_transaction_id in transaction_dictionary:
    return transaction_dictionary[old_transaction_id]
  else:
    # If the transaction is not found then post a new transaction
    post_resp = requests.post('http://localhost:3003/transactions',
      headers={'Content-type': 'application/json'},
      data = json.dumps({'datetime':tran_datetime, 'note':note})
    )

  new_transaction_id=json.loads(post_resp.text)['_id']
  transaction_dictionary[old_transaction_id]=new_transaction_id

  return new_transaction_id



with open('olddata.json') as json_data:
  d = json.load(json_data)
  json_data.close()

# For each old record...
cnt=0
for old_record in d['olddata']:

  symbol = old_record['symbol']
  currencies_title = old_record['currencies_title']
  accounts_title = old_record['accounts_title']
  new_currency_id=getCurrencyId(symbol, currencies_title)
  new_account_id=getAccountId(accounts_title)
  new_transaction_id=getTransactionId(old_record['transactions_id'], old_record['tran_datetime'], old_record['note'])

  # Now we have all the info we need to post this distribution

  print cnt
  cnt=cnt+1

  post_resp = requests.post('http://localhost:3003/distributions',
    headers={'Content-type': 'application/json'},
    data=json.dumps({
      "account_id": new_account_id,
      "currency_id": new_currency_id,
      "transactions_id": new_transaction_id,
      "amount": old_record['amount'],
      "drcr": old_record['drcr']
    })
  )

