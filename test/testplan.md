#A Strategy of Testing

There is very little in this app that needs conventional
"unit testing."  The vast majoring of the desired testing
 is aimed at making API calls and verifying their
 correct operation by making other API calls.

##HTTP and Promises

In our testing we're going to make asynch API calls.  We'll examine
the results (or errors) that we receive.  Because the testing is 
communicating with the System Under Test via HTTP, we have some constraints
regarding the use of Promises and error handling.  

Basically, we cannot use them when making the actual HTTP calls.  
HTTP doesn't return Promises and whatever errors may be thrown by the 
 server would only be communicated back to the testing client via HTTP.
  
So... our HTTP calls will make use of whatever asynchronicity is supported
by our library (presently Superagent) and our testing will pick apart the
HTTP result.