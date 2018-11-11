//  Javascript class with a constructor that takes 3 strings and stores them. This acts as the schema for the data in MongoDB.
module.exports = class Document {
    constructor(title, username, body) {
      this.title = title
      this.username = username
      this.body = body
    }
  }