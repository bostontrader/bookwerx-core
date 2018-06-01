I need a UI to communicate with the server.  HTTP is an obvious reasonable first effort.  But the choice of using REST is not so obvious.  There's a snake-nest of needless nuance between POST and PUT and there's a lot of variation about which HTTP client supports with HTTP verb.  So therefore I'm going to simplify and hereby promulgate the following guidelines:

1. GET is obvious and easy.  Whenever I wish to merely retrive data, I will use a GET.

2. POST is my choice whenever I wish to create new documents.

I hereby prohibt the use of custom _id and mandate the use of the server assigned id.  Allowing both merely makes development and testing more difficult.  Let's start with this simple case. If the new document contains an _id field, then error.

POST /collection {full record w/o id}  -> mongo insertOne forceServerObjectId
reply ...
  201 Created
  Location: /collection/newid

3. PUT is my choice whenever I wish to modify an existing document. Whenever we modify an existing document we must have the id.  We may also want to replace the entire document or merely update a few provided fields.  I hereby mandate that all changes replace the entire document.

PUT/collection/:id {full record w/id} -> mongo findOneAndReplace
Response 200 OK

4. DELETE for deletes.  My restify server can do delete and my UI client can send them.  Problem solved.
Response 200 OK