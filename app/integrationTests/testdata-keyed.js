/*
These documents have a manually assigned _id for the convenience of testing. In production use you can do the same if you like or just let mongo assign the ids.  But if we assign them ourselves, we need to ensure that they are unique within a collection.  Be careful!
 */

const book0 = {

  accounts:[
    {"_id":"acct0Bank", "title":"Bank of Mises"},
    {"_id":"acct0Cash", "title":"Cash in Mattress"},
    {"_id":"acct0OwnersEquity", "title":"OwnersEquity"},
    {"_id":"acct0ExpRent", "title":"Rent"},
    {"_id":"acct0Revenue", "title":"Mercenary Services"}
  ],
  categories:[
    {"_id":"cat0Asset", "symbol":"A", "title":"Asset"},
    {"_id":"cat0AssetLiquid", "symbol":"Liq", "title":"Liquid Asset"},
    {"_id":"cat0Expense", "symbol":"Ex", "title":"Expense"},
    {"_id":"cat0ExpenseRent", "symbol":"ExRent", "title":"Rent"},
    {"_id":"cat0Revenue", "symbol":"R", "title":"Revenue"}
  ],
  currencies:[
    {"_id":"cur0BTC", "symbol":"BTC", "title":"Bitcoin"},
    {"_id":"cur0LTC", "symbol":"LTC", "title":"Litecoin"}
  ],
  transactions:[
    {"_id":"tx01", "datetime":"2017-08-15 08:00:00", "note":"Initial capital"},
    {"_id":"tx02", "datetime":"2017-08-15 08:05:00", "note":"Legal fees"}
  ],
  distributions:[]
}

const book1 = {
  accounts:[
    {"_id":"acct1Bank", "title":"The One Bank"},
    {"_id":"acct1ExpBlow", "title":"blow"},
    {"_id":"acct1ExpHookers", "title":"hookers"},
  ],
  categories:[
    {"_id":"cat1Asset", "symbol":"A", "title":"Asset"},
    {"_id":"cat1Expense", "symbol":"Ex", "title":"Expense"},
  ],
  currencies:[
    {"_id":"cur1BTC", "symbol":"BTC", "title":"Bitcoin"},
    {"_id":"cur1LTC", "symbol":"LTC", "title":"Litecoin"}
  ],
  transactions:[],
  distributions:[]
}

export {book0}
export {book1}
