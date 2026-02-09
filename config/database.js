const { MongoClient } = require("mongodb")

const MONGO_URL = process.env.MONGO_URL

const client = new MongoClient(MONGO_URL)

let database
async function connect_DB() {
  try {
    await client.connect()
    console.log("MongoDB connected")
    database = client.db("HotelBook")
  } catch (err) {
    console.error("Error connecting to MongoDB:", err)
  }
}
function get_DB() {
  if (!database) throw new Error("Database not connected")
  return database
}
module.exports = { connect_DB, get_DB }