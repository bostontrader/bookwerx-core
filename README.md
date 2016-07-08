#Introduction

The purpose of **bookwerx-core** is to provide an API that supports multi-currency
 bookkeeping, using the double-entry bookkeeping model, slightly adapted to squeeze 
 in multiple currencies.  It uses [node](https://nodejs.org), [express](http://expressjs.com/), and [mongodb](https://www.mongodb.com/).

Any application that deals with "money" (fiat, precious metals, cryptocoins) will
quickly encounter the need for bookkeeping.  Rolling your own methods are as usual,
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

### Next...

* git clone https://github.com/bostontrader/bookwerx-core.git

* From inside the bookwerx-core directory: npm install


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


##API Notes
* All API calls return JSON.
* Any call that returns JSON containing a key
entitled 'error' did not succeed.  Please scrutinize the
value of 'error' for clues about the problem.
* Any GET that is successful will return what you expect.
* Any call that is _not_ GET and _is_ successful will
return {"result":"ok"}
