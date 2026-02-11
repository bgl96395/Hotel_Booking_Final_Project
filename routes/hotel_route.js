const express = require("express")
const router = express.Router()
const controller = require("../controllers/hotels_controller")
const admin = require("../middleware/admin_middleware")

router.get("/api/hotels",controller.get_hotels)
router.get("/api/hotels/:id",controller.get_hotel_by_id)
router.post("/api/hotels",admin,controller.create_hotel)
router.put("/api/hotels/:id",admin,controller.update_hotel)
router.delete("/api/hotels/:id",admin,controller.delete_hotel)

module.exports = router