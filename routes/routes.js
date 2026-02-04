const express = require("express")
const session = require("express-session")
const router = express.Router()
const handler = require("../handlers/hotels_handler")

const admin_middleware = (req,res,next)=>{
    if(req.session.user && req.session.user.role === "admin"){
        next()
    }
    else{
        res.status(403).send("Access denied")
    }
}

router.get("/api/hotels",handler.get_hotels)
router.get("/api/hotels/:id",handler.get_hotel_by_id)
router.post("/api/hotels",admin_middleware,handler.create_hotel)
router.put("/api/hotels/:id",admin_middleware,handler.update_hotel)
router.delete("/api/hotels/:id",admin_middleware,handler.delete_hotel)

module.exports = router