import requests
import json
from pprint import pprint

def findCurrencyId(symbol,title):

  currencies_collection = requests.get('http://localhost:3003/currencies',headers={'Content-type': 'application/json'})
  #print resp.text
  currency_id=""
  for currency in json.loads(currencies_collection.text):
    #print "target_currency_symbol"
    #print currency
    # If symbol is present in this list, then pluck the currency_id
    if currency['symbol'] == symbol:
      print "existing currency_id"
      currency_id=currency['_id']
      print currency_id
      break

  # If the currency is not found then post a new currency
  if currency_id=="":
    post_resp = requests.post('http://localhost:3003/currencies',
      headers={'Content-type': 'application/json'},
      data = json.dumps({'symbol':symbol,'title':title}))
    #print resp.text
    print "new currency_id"
    currency_id=json.loads(post_resp.text)['_id']

    # and then use it's currency_id
    return currency_id

def findAccountId(title):

  accounts_collection = requests.get('http://localhost:3003/accounts',headers={'Content-type': 'application/json'})
  #print resp.text
  account_id=""
  for account in json.loads(accounts_collection.text):
    #print "target_account_symbol"
    #print account
    # If symbol is present in this list, then pluck the account_id
    if account['title'] == title:
      print "existing account_id"
      account_id=account['_id']
      print account_id
      break

  # If the account is not found then post a new account
  if account_id=="":
    post_resp = requests.post('http://localhost:3003/accounts',
      headers={'Content-type': 'application/json'},
      data = json.dumps({'title':title}))
    #print resp.text
    print "new account_id"
    account_id=json.loads(post_resp.text)['_id']

    # and then use it's account_id
    return account_id

#with open('/home/radloff/Desktop/acctwerx-prod-07-31-16.json') as json_data:
with open('olddata.json') as json_data:
  d = json.load(json_data)
  json_data.close()
  #print(len(d['olddata']))
  #print(d['olddata'][1]['symbol'])

# For each old record...
for old_record in d['olddata']:
  print ('-----')
  #print(old_record)

  symbol = old_record['symbol']
  currencies_title = old_record['currencies_title']
  accounts_title = old_record['accounts_title']
  #print old_record['symbol']
  currency_id=findCurrencyId(symbol, currencies_title)
  print currency_id

  account_id=findAccountId(accounts_title)
  print account_id

      #resp = requests.get('http://localhost:3003/currencies',headers={'Content-type': 'application/json'})
      #print resp.text
      #currency_id=""
      #for currency in json.loads(resp.text):
        #print "target_currency_symbol"
        #print currency
        # If symbol is present in this list, then pluck the currency_id
        #print "existing currency_id"
        #if currency['symbol'] == s['symbol']:
          #currency_id=currency['_id']
          #print currency_id
          #break

      # else post a new currency
      #if currency_id=="":
        #resp = requests.post('http://localhost:3003/currencies',
        #headers={'Content-type': 'application/json'},
        #data = json.dumps({'symbol':'RMB','title':'ren min bi'}))
        #print resp.text
        #currency_id=json.loads(resp.text)['_id']
        ##print "new currency_id"
        # and then use it's currency_id
