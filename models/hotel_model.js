const { get_DB } = require("../config/database")

function hotel_collection() {
  const database = get_DB()
  return database.collection("hotels")
}

module.exports = hotel_collection
