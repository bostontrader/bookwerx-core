Many of the collections in this app require references to documents in other collections. For example an account may have references to several categories. How we implement this and how we test it go hand in hand.

The simplest method of implementation is to have an array of foreign objects embedded in a document.  Thus, no reference required.  This is suitable for small quantities of simple sub-documents that are actually constituents of the containing document.  This situation is not relevant for this app for reasons left as an exercise for the reader.

A 2nd method of implementation is to have an array of (ObjectId of foreign objects) embedded in a document.

A 3rd method of implementation is to have a "join table" that contains documents which contain ObjectId pointing to the relevant objects that need references.  One advantage with this method is that the join table document itself can have additional information regarding the relationship between the related documents.  However, this is not applicable in this app so we won't use it.

A discussion of the general pros and cons of each method are beyond the scope of this document.  Here, I will merely bang fist on table and assert policy:

1. Unless there is some compelling reason otherwise, by default select method #2, the embedded array of Object Id.

2. Remember YAGNI. Don't try to anticipate every possible referential integrity link.  When the actual necessity of having a particular link arises, then test and implement that link only.