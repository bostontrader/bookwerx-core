[![Build Status](https://travis-ci.org/bostontrader/bookwerx-core.svg?branch=master)](https://travis-ci.org/bostontrader/bookwerx-core)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/bostontrader/bookwerx-core.svg)](https://david-dm.org/bostontrader/bookwerx-core)
[![devDependency Status](https://david-dm.org/bostontrader/bookwerx-core/dev-status.svg)](https://david-dm.org/bostontrader/bookwerx-core#info=devDependencies)
[![Known Vulnerabilities](https://snyk.io/test/github/bostontrader/bookwerx-core/badge.svg)](https://snyk.io/test/github/bostontrader/bookwerx-core)

# Introduction

The purpose of **bookwerx-core** is to provide an http API that supports multi-currency, multi-tenant,
 bookkeeping, using the double-entry bookkeeping model, slightly adapted to squeeze
 in multiple currencies.  It uses [node](https://nodejs.org), [restify](http://restify.com/), and [mongodb](https://www.mongodb.com/).

Any application that deals with "money" (fiat, precious metals, cryptocoins) will
quickly encounter the need for bookkeeping.  Rolling your own methods is, as usual,
 easier said than done, so perhaps you can save yourself some grief and enjoy **bookwerx-core** instead.

With this API, the user can:

* Obtain an API key and secret in order to use the other endpoints.
* Perform ordinary CRUD operations on the various bookkeeping objects,
such as accounts and transactions.
* Perform a variety functions that return aggregated data.
* Perform general "linting" of the db.

This API is the minimum necessary to accomplish the above goals. Extra fancy
features can be found elsewhere.  For example:

A package that provides a web-based user interface can be found at [bookwerx-ui](https://github.com/bostontrader/bookwerx-ui) and for more sophisticated analysis,
such as the production of financial reports and graphing, please see
 [bookwerx-reporting](https://github.com/bostontrader/bookwerx-reporting).


# Getting Started

## Prerequisites

* You will need node and npm.

* You will need git.

* You will need mongodb.

The care and feeding of these items are beyond the scope of these instructions.

**But assuming they are correctly installed...**

```bash
git clone https://github.com/bostontrader/bookwerx-core
cd bookwerx-core
npm install
npm test
npm start
```
Watch the console and you'll see a message telling you what port the server is listening to.

Next, study the section on **runtime configuration** so that you are properly in control of your configurations.

Finally, you'll need a set of API Keys in order to use the API.  Please review the **API** section for this.

## Runtime Configuration

Runtime configuration is managed by [node-config](https://github.com/lorenwest/node-config)
By default, **bookwerx-core** will start the server using /config/default.json.
You may create other configurations to suit your fancy. For example: To use configuration
/config/production.json:

```bash
export NODE_ENV=production
npm start
```

# A Few Words About Testing

This app has no code of its own that we might reasonably want to unit test.  It starts a server and listens for http requests.  When it gets one, the app talks queries a mongo db and sends back the results. Perhaps I'm just [abby normal](https://www.youtube.com/watch?v=yH97lImrr0Q) but I just don't see any value to be had in trying to unit test any of this.  Hence, I do not.

Next I'm tempted to do some integration testing, but I don't do that either.  As mentioned earlier **bookwerx-ui** uses this app. In contemplating testing for both apps, I realized that the test data and sequence of operations should be shared by both apps.  But trying to make this identical test work on both sides proved to be needlessly complicated.  Why am I wasting my time with this!? If UI has thorough integration testing, then indirectly so does this app.  So I rely upon UI to do the testing.  If it works, then so does this app.

Finally, I also don't care about test coverage.  Obviously some of these paths get covered.  And I'm fairly certain that most of the code does indeed get covered.  If there are other bits that are neglected the consequences will eventually manifest themeselves and I can then rectify. Perhaps this divine insight will enable Wintermute to get that key that's been lost in the wardrobe all these years, but probably not.  In any event, I'm going to live dangerously and just take my chances. Until and unless I discover otherwise, agonizing over code coverage just doesn't earn its keep.

That said, I do have basically a test stub for **npm test**.  I want to placate Travis CI and I might also eventually find some useful things that are worthy of testing.

# Dependencies

* config - Manage different configurations.

* crypto-random-string - Generate random strings for the API keys.

* mongodb - This is our db.

* restify - This is the http server.

* restify-cors-middleware - Need this in order to deal with CORS

* restify-plugins - Need this in order to see the request query string and the body.

# devDependencies

* babel-cli

* babel-preset-es2015


# Working with Multiple Currencies

**bookwerx-core** enables the user to maintain a list of currencies relevant to their app.
Fiat, precious metals, and cryptocoins are three obvious examples of currencies that
this app could easily handle.

The "distributions" of a transaction (the debits and credits part) are all tagged
with a currency and a single transaction can include any number of different
currencies.

Any transaction which includes only a single currency should satisfy the usual
sum-of-debits = sum-of-credits constraint.

Any transaction which includes two currencies should still satisfy that constraint.
[But...](https://www.youtube.com/watch?v=FaVFuX8z26c) We can modify said constraint
a wee bit to make it fit. As you can readily imagine, the actual numbers involved
won't add up the way we ordinarily expect. Instead, you can compute an
implied exchange rate R such that sum-of-debits * R = sum-of-credits.

But be careful with this.  Although simple transactions such as currency exchanges
can easily be recorded by debiting one currency and crediting the other, you
could easily make nonsensical transactions if you're not paying attention when you do this.

# Validation

Notice I say "you" can do this or that, not **bookwerx-core**. This is intentional and keeping
with the principal that this core is a minimalist thing.  Although there is a core of necessary
referential integrity constaints that **bookwerx-core** enforces,
extra fancy features, such as validation belong elsewhere.  You may easily use this API to make
 non-sensensical entries into your records.  GIGO.

# On Categories and Ordering

There are several places where we might want to "categorize" the various accounts. Not only
do we want to categorize them, but we also want to deal with them in a particular order.

Some examples:

1. Each account might be one of [Assets, Liabilities, Equity, Revenue, Expenses] and these broad categories have a customary position in financial statements.

2. Asset categorization might be further subdivided into Current, Equipment, and Building with them
appearing on a report in that order.

3. "Liquid" accounts such as cash-in-mattress, bank deposits, and perhaps short-term notes, might be tagged so that
they could all appear on a graph.

I will spare you the hand-wringing, agonization, and derivation that led to our final solution, and cut to the chase.
The bottom line is that, considering how broad and diverse this problem is, attempting to build a robust system that can
 manage these groupings is far beyond the scope of this app.  So in keeping with the minimalist philosophy, **bookwerx-core**
 provides the following minimal solution. It:

1. Maintains a collection of categories.

2. Maintains a collection of "accounts_categories".  Each account_category points to exactly one account and one
category.  In this way, an account can be tagged with zero or more categories, and a category may
apply to zero or more accounts.

This is the essential minimal foundation required.  In light of this let's revisit the prior
 examples and see how they could be implemented.

1. Create categories for "Assets","Liabilities","Equity","Revenue", and "Expenses."  Every account gets tagged with exactly one of these.  The Balance Sheet and Income Statements verify this and display their information in a hardwired customary order.  The report decides how to order individual accounts, perhaps alphabetically by their titles.

2. Create categories for "Current" and "Long-term" (for example.)  Assets deemed "current" or "long-term" get tagged thus.  The financial reports will display current assets before long-term because it's hardwired to look for these categories and display them in said order.  We can use the same same tags for liabilities. The financial reports should include an implicit category for "uncategorized" to include accounts that are not otherwise categorized.

3. Create categories for "cash", "bank", and "short-term note".  Tag certain accounts as one or the other of these.  A graph can operate only on these specific accounts and seperately display each category.  No individual accounts need apply.

In each case it is the reponsibility of the report or graph to understand the available categories, present
them in the proper order, and to ensure that the categorization is plausible. For example, nothing should be tagged as an
asset _and_ a liability.

# Data Analysis

As mentioned earlier, this package merely records the basic bookkeeping objects.
More sophisticated analysis belongs in other packages such as
[bookwerx-reporting](https://github.com/bostontrader/bookwerx-reporting).  "What actually happened" (the transactions) belong here.
But "what does any of this mean" belongs elsewhere.


# API

## Keys

The first step in using this system is to obtain a set of API keys.  This is easy:

GET /apikeys

This will return the set of keys that you need for the other API endpoints.

All calls to the trading API are sent via HTTP POST and must contain the following headers:

    Key - Your API key.
    Sign - The query's POST data signed by your key's "secret" according to the HMAC-SHA512 method.

 "command" POST parameter:

## Errors

Any errors returned will be JSON with a schema like {'error': {'some error message'}}
In the event that more than one error could apply, only the first error found
is returned.
Recall the earlier discussion of validation and its absence here.

## Enough talk. Let's see the API!

Accounts

GET /accounts
Returns a JSON array of account documents.

GET /accounts/:id
Returns a JSON object containing a single account document.
Possibly error 1.

POST /accounts
Add a new account document. Returns what was just written, plus the newly assigned
_id.

PUT /accounts/:id
Modify an existing account, no upsert.
Possibly error 1.

DELETE /accounts/:id
Guess what this does?
Possibly return errors 1 or 2.

Currencies

GET /currencies
Returns a JSON array of account documents.

GET /currencies/:id
Returns a JSON object containing a single account document.
Possibly error 1.

POST /currencies
Add a new account document. Returns what was just written, plus the newly assigned
_id.

PUT /currencies/:id
Modify an existing account, no upsert.
Possibly error 1.

DELETE /currencies/:id
Guess what this does?
Possibly return errors 1 or 2.

Possible errors:
1.  Document n does not exist
2.  This document cannot be deleted because some distributions refer to it






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

Authentication:

1. Using the key API generate a Key and a Secret pair.

2. When calling to the private API send 'sig' as a header where 'sig' = HMAC-SHA512 encoding of the body, using the secret.

3. The body should contain the key and the signature means that the sender has the secret.  This should still be sent via HTTPS.

4. Every collection is filtered on the key.

the the Key in the header and tthe he body of the message The query's POST data signed by your key's "secret" according to the HMAC-SHA512 method.