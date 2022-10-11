const { MongoClient } = require('mongodb')

const client = new MongoClient(process.env.MONGODB_URI)
const clientPromise = client.connect()

module.exports = { clientPromise }