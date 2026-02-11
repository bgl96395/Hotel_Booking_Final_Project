const {get_DB} = require("../config/database")

function booking_collectiion(){
  const database = get_DB()
  return database.collection("Bookings")
}

module.exports = booking_collectiion