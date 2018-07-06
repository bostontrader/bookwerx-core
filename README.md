[![Build Status](https://travis-ci.org/bostontrader/bookwerx-core.svg?branch=master)](https://travis-ci.org/bostontrader/bookwerx-core)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/bostontrader/bookwerx-core.svg)](https://david-dm.org/bostontrader/bookwerx-core)
[![devDependency Status](https://david-dm.org/bostontrader/bookwerx-core/dev-status.svg)](https://david-dm.org/bostontrader/bookwerx-core#info=devDependencies)
[![Known Vulnerabilities](https://snyk.io/test/github/bostontrader/bookwerx-core/badge.svg)](https://snyk.io/test/github/bostontrader/bookwerx-core)

# Introduction

The purpose of **bookwerx-core** is to provide an HTTP API that supports multi-currency bookkeeping, using the double-entry bookkeeping model, slightly adapted to squeeze
 in multiple currencies.  It uses [node](https://nodejs.org), [restify](http://restify.com/), and [mongodb](https://www.mongodb.com/).

Any application that deals with "money" (fiat, precious metals, cryptocoins) will
quickly encounter the need for bookkeeping.  Rolling your own methods is, as usual,
 easier said than done, so perhaps you can save yourself some grief and enjoy **bookwerx-core** instead.

With this API, the user can:

* Perform ordinary CRUD operations on the various bookkeeping objects,
such as accounts and transactions.
* Perform a variety of functions that return aggregated data.
* Perform general "linting" of the db.

This API is the minimum necessary to accomplish the above goals. Extra fancy
features can be found elsewhere.  For example:

A package that provides a web-based user interface can be found at [bookwerx-ui](https://github.com/bostontrader/bookwerx-ui) and for more sophisticated analysis,
such as the production of financial reports and graphing, please see
 [bookwerx-reporting](https://github.com/bostontrader/bookwerx-reporting).

# NOTICE:

This code is presently very sloppy.  It's a commented-out re-do of an earlier effort.  It's in git at all just to get the DevOps cycle going. Please bless this mess.

# Getting Started

## Prerequisites

* You will need node >= 8.5.0 and approx npm 6.0.1.

* You will need git.

* You will need mongodb.

The care and feeding of these beasts are beyond the scope of these instructions.

**But assuming they are correctly installed...**

```bash
git clone https://github.com/bostontrader/bookwerx-core
cd bookwerx-core
npm install
```

Next, study the section on **runtime configuration** so that you are properly in control of your configurations.  Using this [new learning](https://www.youtube.com/watch?v=9D5_V72jMtM&t=1323), tweak the following example as necessary:

```bash
BW_PORT=3003 BW_MONGO=mongodb://127.0.0.1:27017/bookwerx-core-test BWCORE_HOSTNAME=127.0.0.1 BW_TEST=true node integrationTest.js
```

Next, tweak package.json scripts.start, if necessary, to point to an active mongodb server that you can use for development purposes. And then:

```bash
npm start
```

## Runtime Configuration

You provide runtime configuration via environment variables. There are no other defaults and if these variables are not correctly set, then the server will not start.  These parameters can be fed to node on the command line.  See package.json scripts.start for an example to start the server in "development" mode and scripts.test for an example to start the tests in "test" mode.

The following env variables are used by **bookwerx-core**:

* BW_PORT - Which port shall **bookwerx-core** listen to?

* BW_MONGO - A connection string for your Mongodb.  For example: mongodb://127.0.0.1:27017/bookwerx-core-development

In addition to the above, in order to get the testing to work, we need:

* BW_TEST=true - Testing will not work unless this is set to true. Don't fubar thy production data!

* BWCORE_HOSTNAME - The domain portion of the url for the **bookwerx-core** server.  For example: 127.0.0.1.  Testing will assume 'http' and use the value of BW_PORT.


# A Few Words About Testing

This app has no code of its own that we might reasonably want to unit test.  It starts a server and listens for http requests.  When it gets one, the app queries a mongo db and sends back the results. Perhaps we are just [abby normal](https://www.youtube.com/watch?v=inqdiNVzQcc&t=37) but we just don't see any value to be had in trying to unit test any of this.  Hence, we do not.

Using similar logic we are also tempted to ditch integration testing.  But we cannot bring ourselves to do that.  However, in order to make a decent test, we need to hand-craft a fairly elaborate set of example data and execute a tedious sequence of operations on them.  We make use of example data from **bookwerx-testdata** to do this.

Finally, we don't care much about code coverage.  Obviously some of these paths get covered.  And we are fairly certain that most of the code does indeed get covered.  If there are other bits of code that are neglected the consequences will eventually manifest themeselves and we can then rectify. Perhaps this divine insight will enable Wintermute to get that key that's been lost in the wardrobe all these years, but probably not.  In any event, we are going to live dangerously and just take our chances. Until and unless we discover otherwise, agonizing over code coverage, in this context, is just another way to [fritter and waste the hours in an off-hand way](https://www.youtube.com/watch?v=JwYX52BP2Sk&t=140)


# Brainwipe

In testing we need to [nuke it (the db) from orbit](https://www.youtube.com/watch?v=nnHmUk_J6xQ&t=27) and start over. How shall we do that?

* Maybe directly build this capacity into the API.

* Maybe use the API to enumerate the existing objects and delete them in a suitable order.

* Maybe simply invoke dropDatabase on the mongodb driver.

None of these choices are obviously good. We think the first choice is obviously bad, and the second is a lot of work for not much benefit. Choice the last, dropDatabase, is easy to implement and is a good enough solution for now.

# Dependencies

* mongodb - No party is complete without mongo.

* restify - We need an HTTP server.

* restify-plugins - We need to be able to access the query parameters and response body.


# devDependencies

* bookwerx-testdata

* colors - We want to be able to print pretty colors on the console

* restify-clients - The tester will need a json client to do its thing.

* standard - Code linter


# On require vs import

There exists a giant can of worms re: using the 'require' statement vs the 'import' statement.  The bottom line, IOHO, is that the 'import' statement, although shiny, new, and modern, just doesn't earn its keep.  Everybody else in the world already uses 'require' and that works well enough, especially in this particular context. At this time, the 'import' statement is not very well supported and requires too many contortions to use.  All this and for what benefit?  So we can load modules asynchonously? Homey don't play that.

# Working with Multiple Currencies

**bookwerx-core** enables the user to maintain a list of currencies relevant to its app. Fiat, precious metals, and cryptocoins are three obvious examples of currencies that this app could easily handle.

The "distributions" of a transaction (the debits and credits part) are all tagged with a currency and a single transaction can include any number of different currencies.

Any transaction which includes only a single currency should satisfy the usual sum-of-debits = sum-of-credits constraint.

Any transaction which includes two currencies should still satisfy that constraint. [But...](https://www.youtube.com/watch?v=FaVFuX8z26c) We can modify said constraint a wee bit to make it fit. As you can readily imagine, the actual numbers involved won't add up the way we ordinarily expect. Instead, you can compute an implied exchange rate R such that sum-of-debits * R = sum-of-credits.

But be careful with this.  Although simple transactions such as currency exchanges can easily be recorded by debiting one currency and crediting the other, you could easily make nonsensical transactions if you're not paying attention when you do this.

# Validation

Notice We say "you" can do this or that, not **bookwerx-core**. This is intentional and keeping with the principal that this core is a minimalist thing.  Although there is a core of necessary referential integrity constaints that **bookwerx-core** enforces, extra fancy features, such as validation belong elsewhere.  You may easily use this API to make non-sensensical entries into your records.  GIGO.

# Random Junk...

Stuff after here is not reliable.  Beware.

# On Categories and Ordering

There are several places where we might want to "categorize" the various accounts. Not only do we want to categorize them, but we also want to deal with them in a particular order.

Some examples:

1. Each account might be one of [Assets, Liabilities, Equity, Revenue, Expenses] and these broad categories have a customary position in financial statements.

2. Asset categorization might be further subdivided into Current, Equipment, and Building with them
appearing on a report in that order.

3. "Liquid" accounts such as cash-in-mattress, bank deposits, and perhaps short-term notes, might be tagged so that
they could all appear on a graph.

We will spare you the hand-wringing, agonization, and derivation that led to our final solution, and cut to the chase.
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
