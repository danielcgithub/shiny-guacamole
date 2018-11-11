// Initialize and export an Express Router that contains all of our API routes. 
const express = require('express')

const Document = require('../models/Document')
const router = express.Router()


// Each route takes the form of the router object followed by the HTTP method. 
// Inside each route we then define the path and an arrow lambda to handle our request (req) and response (res). 
// The next variable is commonly called if a function does not return and instead wants to pass the request further down the middleware stack.


// In each route inside the arrow lambda 
// we start off by getting the MongoDB connection from our server level variable req.app.locals.db 
// followed by the collection we want. 
// In this case we only have one collection, documents. 
// And then in each case we call a method to return some data or an error from the database.


// find() gets all documents in the collection — /documents/all
router.get('/documents/all', (req, res, next) => {
    req.app.locals.db.collection('documents').find({}).toArray((err, result) => {
      if (err) {
        res.status(400).send({'error': err})
      }
      if (result === undefined || result.length === 0) {
        res.status(400).send({'error':'No documents in database'})
      } else {
        res.status(200).send(result)
      }
    })
  })

// A colon in front of a word in a route denotes a parameter that is accessed inside the handlers using req.params. 
// _id is automatically assigned to each document by MongoDB which is why we don’t have a unique identifier or 
// other primary key in our data model. 
// After we’ve made a database query we either get back data (result) or an error (err). 
// Our error handling behavior is to use our res object to send back an HTTP 400 and JSON that contains the error. 
// Otherwise we send back HTTP 200 and the result of the query.

// findOne() gets a specific document in this case based on a document id provided by the client — /documents/:id
router.get('/documents/:id', (req, res, next) => {
    req.app.locals.db.collection('documents').findOne({
      '_id': req.params.id
    }, (err, result) => {
      if (err) {
        res.status(400).send({'error': err})
      }
      if (result === undefined) {
        res.status(400).send({'error':'No document matching that id was found'})
      } else {
        res.status(200).send(result)
      }
    })
  })

// insertOne() uploads a new document into the database — /documents/new
router.post('/documents/new', (req, res, next) => {
    const newDocument = new Document(req.body.title, req.body.username, req.body.body)
    req.app.locals.db.collection('documents').insertOne({
      newDocument
    }, (err, result) => {
      if (err) {
        res.status(400).send({'error': err})
      }
      res.status(200).send(result)
    })
  })

// deleteOne() removes a document based on a document id provided by the client — /documents/delete/:id
router.delete('/documents/delete/:id', (req, res, next) => {
    req.app.locals.db.collection('documents').deleteOne({
      '_id': req.params.id
    }, (err, result) => {
      if (err) {
        res.status(400).send({'error': err})
      }
      res.status(200).send(result)
    })
  })  

// updateOne() changes a document based on a JSON request body sent by the client — /documents/edit/:id
router.patch('/documents/edit/:id', (req, res, next) => {
    req.app.locals.db.collection('documents').updateOne({
      '_id': req.params.id
    }, 
    {$set:
      {
        title: req.body.title,
        username: req.body.username,
        body: req.body.body
      }
    }, (err, result) => {
      if (err) {
        res.status(400).send({'error': err})
      }
      res.status(200).send(result)
    })
  })
  

  //export our router object so we can use it in index.js as routing middleware for the /api route. 
  // This means that our full path for every API route is /api/documents/
  module.exports = router