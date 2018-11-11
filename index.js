const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient


// setup our database name based on development or production environment, assign the MongoDB url from environment variables, and set options for our MongoDB client.

const dbName = process.env.NODE_ENV === 'dev' ? 'database-test' : 'database' 
const url = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${dbName}:27017?authMechanism=SCRAM-SHA-1&authSource=admin`
const options = {
  useNewUrlParser: true, 
  reconnectTries: 60, 
  reconnectInterval: 1000
}

// import our router, set our server port from environment but defaulting to 80, and the next two lines are boilerplate Express setup.

const routes = require('./routes/routes.js')
const port = process.env.PORT || 80
const app = express()
const http = require('http').Server(app)


// You generally want your body-parser middleware parsers first in an API so every request gets parsed. 
// Then your request hits your server’s router, if it matches any of the routes described inside than the 
// corresponding function will trigger and all is well. 
// If no routes are matched then our server will return a 404 Not Found.

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', routes)
app.use((req, res) => {
  res.status(404)
})


    // connects our MongoClient to our MongoDB instance. Always handle your errors in some manner but in this case we want to log an error and exit.

MongoClient.connect(url, options, (err, database) => {
    if (err) {
      console.log(`FATAL MONGODB CONNECTION ERROR: ${err}:${err.stack}`)
      process.exit(1)
    }
    // assigning our database connection to a server global variable and start our server
    app.locals.db = database.db('api')
    http.listen(port, () => {
      console.log("Listening on port " + port)
      app.emit('APP_STARTED')
    })
  })
  
  module.exports = app