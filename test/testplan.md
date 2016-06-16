#A Strategy of Testing

There is very little in this app that needs conventional
"unit testing."  The vast majoring of the desired testing
 is aimed at making API calls and verifying their
 correct operation by making other API calls.

Testing the API calls is potentially tedious
because of the need to setup a possibly elaborate database
environment, prior to testing.  Multiply this headache by
 the quantity of API calls and their variations, and you
 can readily see that this could get out of hand.

In order to manage this issue, we will make a long test
that makes several API calls, that are carefully designed
 to collectively work the possibilities of correct
 operation and error.  In this way, earlier successful
 tests lay eventually populate the db for subsequent
 testing.

##Referential Integrity
The db have a variety of referential integrity
constraints.  Primary and foreign keys, as well as issues
relating orphans and cascading updates and deletes are
obvious examples.

##Bainwipe.
The API offers a method to completely erase
the db. Ideally, we would populate the db, brainwipe it,
and then verify that the db is empty.  However, instead
of populating the db first, we'll simply use whatever
records are left over from prior testing.

Although this strategy departs from the customary method
 of starting a test each time with identical inputs, I
 judge this to be an efficient and effective way to get
 complex data that brainwipe can deal with.