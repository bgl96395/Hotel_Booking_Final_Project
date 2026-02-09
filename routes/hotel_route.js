const express = require("express")
const router = express.Router()
const handler = require("../controllers/hotels_controller")
const admin = require("../middleware/admin_middleware")

router.get("/api/hotels",handler.get_hotels)
router.get("/api/hotels/:id",handler.get_hotel_by_id)
router.post("/api/hotels",admin,handler.create_hotel)
router.put("/api/hotels/:id",admin,handler.update_hotel)
router.delete("/api/hotels/:id",admin,handler.delete_hotel)

module.exports = router