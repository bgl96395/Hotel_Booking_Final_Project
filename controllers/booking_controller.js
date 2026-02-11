const { ObjectId } = require("mongodb")
const booking_collection = require("../models/booking_model")
const hotel_collection = require("../models/hotel_model")

exports.create_booking = async (req, res) => {
  try {
    const {hotel_id,name,check_in,check_out} = req.body
    const user =req.session.user

    if(!ObjectId.isValid(hotel_id) || !check_in || !check_out){
      return res.status(400).json({
        error:"Missing or invalid fields!"
      })
    }

    const hotels = hotel_collection()
    const hotel = await hotels.findOne({_id: new ObjectId(hotel_id)})

    if(!hotel){
      return res.status(404).json({
        error:"Hotel not Found"
      })
    }

    const check_in_date = new Date(check_in)
    const check_out_date = new Date(check_out)
    const nights = Math.ceil((check_out_date - check_in_date)/(1000 * 60 * 60 * 24))

    if(nights <= 0){
      return res.status(400).json({
        error:"Invalid stay duration"
      })
    }

    const total_price = hotel.price_per_night * nights

    const booking = {
      user_id: user.id,
      hotel_id: hotel_id.toString(),
      name: name,
      check_in: check_in_date,
      check_out: check_out_date,
      total_price,
      created_at: new Date()
    }

    const bookings = booking_collection()
    await bookings.insertOne(booking)
    res.status(200).json({
      message:"Booking created successfully",
      name:name,
      total_price:total_price,
      check_in:check_in_date,
      check_out_date:check_out_date,
      hotel: hotel.name
    })

  }catch(e){
    res.status(500).json({
      error:`Database error${e}`
    })
  }
}

exports.get_my_bookings = async (req,res) =>{ 
  try{ 
    const bookings = booking_collection() 
    const result = await bookings.find({ user_id: req.session.user.id }).toArray() 
    res.status(200).json(result) 
  }catch{ 
    res.status(500).json({ 
      error:"Database error" 
    }) 
  } 
}

exports.get_all_bookings = async (req,res)=>{ 
  try{ 
    if(!req.session.user || req.session.user.role !== "admin"){ 
      return res.status(401).json({ 
        error:"Access denied" 
      }) 
    } 
    const bookings = booking_collection() 
    const result = await bookings.find().toArray() 
    res.status(200).json(result) 
  }catch{ 
    res.status(500).json({ 
      error:"Database error"
     }) 
    } 
  }

exports.delete_booking = async (req, res) => {
  try {
    const booking_id = req.params.id
    const user = req.session.user

    if (!ObjectId.isValid(booking_id)) {
      return res.status(400).json({ error: "Invalid booking id" })
    }

    const bookings = await booking_collection()
    const booking = await bookings.findOne({ _id: new ObjectId(booking_id) })
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    let isOwner
    if(booking.user_id.toString() === user.id.toString()){
      isOwner = true
    }
    if (!isOwner && user.role !== "admin") return res.status(403).json({ error: "Not allowed" })

    await bookings.deleteOne({ _id: new ObjectId(booking_id) })
    res.status(200).json({ 
      message: "Deleted successfully"
     })
  } catch {
    res.status(500).json({ 
      error: "Database error" 
    })
  }
}