#Introduction

[![Build Status](https://travis-ci.org/bostontrader/bookwerx-core.svg?branch=master)](https://travis-ci.org/bostontrader/bookwerx-core)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/bostontrader/bookwerx-core.svg)](https://david-dm.org/bostontrader/bookwerx-core)
[![devDependency Status](https://david-dm.org/bostontrader/bookwerx-core/dev-status.svg)](https://david-dm.org/bostontrader/bookwerx-core#info=devDependencies)

The purpose of **bookwerx-core** is to provide an API that supports multi-currency
 bookkeeping, using the double-entry bookkeeping model, slightly adapted to squeeze 
 in multiple currencies.  It uses [node](https://nodejs.org), [restify](http://restify.com/), and [mongodb](https://www.mongodb.com/).

Any application that deals with "money" (fiat, precious metals, cryptocoins) will
quickly encounter the need for bookkeeping.  Rolling your own methods is, as usual,
 easier said than done, so perhaps you can save yourself some grief and enjoy **bookwerx-core** instead.

With this API, the user can:

* Perform ordinary CRUD operations on the various bookkeeping objects,
such as accounts and transactions.

* Perform consistency checks.

* Brainwipe the db and start over.

This API is the minimum necessary to accomplish the above goals. Extra fancy
features can be found elsewhere.  For example:

A package that provides a web-based user interface can be found at [bookwerx-ui](https://github.com/bostontrader/bookwerx-ui) and for more sophisticated analysis, 
such as the production of financial reports and graphing, please see 
 [bookwerx-reporting](https://github.com/bostontrader/bookwerx-reporting).


##Getting Started

### Prerequisites

* You will need node and npm.

* You will need git.

* You will need mongodb.

* In order to run the example data importer, you will need Python and the [requests library](docs.python-requests.org/en/master/user/install).

The care and feeding of these items are beyond the scope of these instructions.

### But assuming they are correctly installed...

```bash
git clone https://github.com/bostontrader/bookwerx-core.git
cd bookwerx-core
npm install
npm test
npm start
```
##Runtime Configuration

Runtime configuration is managed by [node-config](https://github.com/lorenwest/node-config)
By default, **bookwerx-core** will start the server using /config/default.json.
You may create other configurations to suit your fancy. For example: To use configuration
/config/production.json:

```bash
export NODE_ENV=production
npm start
```
##Multiple Currencies

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

##Validation

Notice I say "you" can do this or that, not **bookwerx-core**. This is intentional and keeping
with the principal that this core is a minimalist thing.  Although there is a core of necessary 
referential integrity constaints that **bookwerx-core** enforces,
extra fancy features, such as validation belong elsewhere.  You may easily use this API to make
 non-sensensical entries into your records.  GIGO.

##On Categories and Ordering

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

##Data Analysis

As mentioned earlier, this package merely records the basic bookkeeping objects.
More sophisticated analysis belongs in other packages such as
[bookwerx-reporting](https://github.com/bostontrader/bookwerx-reporting).  "What actually happened" (the transactions) belong here.
But "what does any of this mean" belongs elsewhere.


##API

Any errors returned will be JSON with a schema like {'error': {'some error message'}}
In the event that more than one error could apply, only the first error found
is returned.
Recall the earlier discussion of validation and its absence here.

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
