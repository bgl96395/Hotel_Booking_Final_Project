const express = require("express")
const router = express.Router()
const booking = require("../controllers/booking_controller")
const admin = require("../middleware/admin_middleware")

router.post("/api/bookings",booking.create_booking)
router.get("/api/bookings/my",booking.get_my_bookings)
router.get("/api/bookings/all",admin,booking.get_all_bookings)
router.delete("/api/bookings/:id",booking.delete_booking)

module.exports = router