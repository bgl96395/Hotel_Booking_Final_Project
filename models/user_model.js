const { get_DB } = require("../config/database")

function user_collection() {
  const database = get_DB()
  return database.collection("users")
}

module.exports = user_collection;