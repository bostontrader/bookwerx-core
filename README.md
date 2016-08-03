#Introduction

[![Build Status](https://travis-ci.org/bostontrader/bookwerx-core.svg?branch=master)](https://travis-ci.org/bostontrader/bookwerx-core)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/bostontrader/bookwerx-core.svg)](https://david-dm.org/bostontrader/bookwerx-core)
[![devDependency Status](https://david-dm.org/bostontrader/bookwerx-core/dev-status.svg)](https://david-dm.org/bostontrader/bookwerx-core#info=devDependencies)

The purpose of **bookwerx-core** is to provide an API that supports multi-currency
 bookkeeping, using the double-entry bookkeeping model, slightly adapted to squeeze 
 in multiple currencies.  It uses [node](https://nodejs.org), [express](http://expressjs.com/), and [mongodb](https://www.mongodb.com/).

Any application that deals with "money" (fiat, precious metals, cryptocoins) will
quickly encounter the need for bookkeeping.  Rolling your own methods is, as usual,
 easier said than done, so perhaps you can save yourself some grief and enjoy **bookwerx-core** instead.

With this API, the user can:

* Perform ordinary CRUD operations on the various bookkeeping objects,
such as accounts and transactions.

* Perform consistency checks.

* Brainwipe the db and start over.

This API is the minimum necessary to populate your db with bookkeeping information,
ensure that it is internally consistent, and nuke it from orbit and start over if necessary.

A package that provides a web-based front-end using Angular 2 can be found at [bookwerx-ui]
(https://github.com/bostontrader/bookwerx-ui) and for more sophisticated analysis, 
such as the production of financial reports and graphing, please see 
 [bookwerx-reporting](https://github.com/bostontrader/bookwerx-reporting).


##Getting Started

### Prerequisites

* You will need node and npm.

* You will need git.

* You will need mongodb.

The care and feeding of these items are beyond the scope of these instructions.

### But assuming they are correctly installed...

```bash
git clone https://github.com/bostontrader/bookwerx-core.git
cd bookwerx-core
npm install
```

##Multiple Currencies

**bookwerx-core** enables the user to maintain a list of currencies relevant to their app.
Fiat, precious metals, and cryptocoins are three obvious examples of currencies that
this app could easily handle.

The "distributions" of a transaction (the debits and credits part) are all tagged
with a currency and a single transaction can include either one or two different
currencies.

Any transaction which includes only a single currency must satisfy the usual
sum-of-debits = sum-of-credits constraint.

Any transaction which includes two currencies must still satisfy that constraint.
[But...](https://www.youtube.com/watch?v=FaVFuX8z26c) We must modify said constraint
a wee bit to make it fit. As you can readily imagine, the actual numbers involved
won't add up the way we expect. Instead, **bookwerx-core** will compute an
implied exchange rate R such that sum-of-debits * R = sum-of-credits.

But be careful with this.  Although simple transactions such as currency exchanges 
can easily be recorded by debiting one currency and crediting the other, you
could easily make nonsensical transactions if you're not paying attention when you do this.

##Data Analysis

As mentioned earlier, this package merely records the basic bookkeeping objects.
More sophisticated analysis belongs in other packages such as
[bookwerx-reporting](https://github.com/bostontrader/bookwerx-reporting).  "What actually happened" (the transactions) belong here.
But "what does any of this mean" belongs elsewhere.


##API

Any errors returned will be JSON with a schema like {'errors': [{'some error message'}]}

Accounts

GET /accounts
Returns a JSON array of account documents.

GET /accounts/:id
Returns a JSON object containing a single account document.
Possibly error 1.

POST /accounts (add a new account) (errors: 3.1, 3.2)
PUT /accounts/:id (modify an existing account, no upsert) (errors: 1, 3.1, 3.2)
DELETE /accounts/:id (errors: 1,2)

Possible errors:
1.  account n does not exist
2.  this account cannot be deleted because some distributions refer to it
3.1 title must be truthy
3.2 title must be unique



currencies
GET /currencies get all of them
GET /currencies/:id get one of them (errors:1)
POST /currencies (add a new currency) (errors:3.1, 3.2, 4.1, 4.2)
PUT /currencies/:id (modify an existing currency, no upsert) (errors:1, 3.1, 3.2, 4.1, 4.2)
DELETE /currencies/:id (errors:1, 2)

Possible errors:
1.  currency n does not exist
2.  this currency cannot be deleted because some distributions refer to it
3.1 symbol must be truthy
3.2 symbol must be unique
4.1 title must be truthy
4.2 title must be unique


transactions
GET /transactions get all of them
GET /transactions/:id get one of them (errors:1)
POST /transactions (add a new transaction) (errors:3)
PUT /transactions/:id (modify an existing transaction, no upsert) (errors:1, 3)
DELETE /transactions/:id (errors:1, 2)

Possible errors:
1.  transaction n does not exist
2.  this transaction cannot be deleted because some distributions refer to it
3.  datetime must be a parseable datetime


distributions
GET /distributions get all of them
GET /distributions/:id get one of them (errors:1)
POST /distributions (add a new distribution) (errors:3-7)
PUT /distributions/:id (modify an existing distribution, no upsert) (errors:1, 3-7)
DELETE /distributions/:id (errors:1)

Possible errors:
1.  distribution n does not exist
3.  drcr sb "dr" or "cr"
4.  amount sb numeric
5.  transaction_id does not reference an existing transaction
6.  account_id does not reference an existing account
7.  currency_id does not reference an existing currency
