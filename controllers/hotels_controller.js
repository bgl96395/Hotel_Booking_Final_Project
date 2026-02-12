const { ObjectId } = require("mongodb")
const hotel_collection = require("../models/hotel_model")

exports.get_hotels = async (req,res)=>{
  try{
    let page = Number(req.query.page) || 1
    let limit = Number(req.query.limit) || 3

    const skip = (page - 1)*limit

    const filter = {}
    if(req.query.country && req.query.country !== ""){
      filter.country = { $regex: req.query.country,$options: "i"}
    }
    if(req.query.stars && req.query.stars !== ""){
      filter.stars = Number(req.query.stars)
    }

    const sort = {}
    if(req.query.priceSort === "asc"){
      sort.price_per_night = 1
    }
    if(req.query.priceSort === "desc"){
      sort.price_per_night = -1
    }

    const hotel = await hotel_collection().find(filter).sort(sort).skip(skip).limit(limit).toArray()
    res.status(200).json(hotel)
  }catch{
    res.status(500).json({
      error: "Database error"
    })
  }
}

exports.get_hotel_by_id =  async (req,res)=>{
  try{
    const hotel_id = req.params.id
    if(!ObjectId.isValid(hotel_id)){
        return res.status(400).json({
            error:"Invalid id"
        })
    }
    const hotel = await hotel_collection().findOne({_id: new ObjectId(hotel_id)})
    if (!hotel){
        return res.status(404).json({
            error:"Hotel not found"
        })
    }
    res.status(200).json(hotel)
  }catch{
    res.status(500).json({
      error:"Database error"
    })
  }
}

exports.create_hotel = async(req,res)=>{
  try{
      const {name,address,city,country,stars,price_per_night,description} = req.body
      if (!name || !address || !city || !country || !stars || !price_per_night || !description){
          return res.status(400).json({
              error:"Missing or invalid fields"
          })
      }
      await hotel_collection().insertOne({name,address,city,country,stars,price_per_night,description})
      res.status(201).json({
          message:"Product created"
      })
  }catch{
    res.status(500).json({
      error:"Database error"
    })
  }
}

exports.update_hotel =  async (req,res)=>{
  try{
    const hotel_id = req.params.id
    const {name,address,city,country,stars,price_per_night,description} = req.body

    if(!ObjectId.isValid(hotel_id)){
      return res.status(400).json({
        error:"Invalid id"
      })
    }

    if (!name && !address && !city && !country && !stars && !price_per_night && !description){
      return res.status(400).json({
        error:"No fields to update"
      })
    }

    const updating_fields = {};
    if (name) {
      updating_fields.name = name
    }
    if (address) {
      updating_fields.address = address
    }
    if (city){ 
      updating_fields.city = city
    }
    if (country){ 
      updating_fields.country = country
    }
    if (stars){
      updating_fields.stars = stars
    }
    if (price_per_night) {
      updating_fields.price_per_night = price_per_night
    }
    if (description) {
      updating_fields.description = description
    }

    const result = await hotel_collection().updateOne({_id: new ObjectId(hotel_id)},{$set: updating_fields})

    if(result.matchedCount===0){
      return res.status(404).json({
        error:"Hotel not found"
      })
    }
    
    res.status(200).json({
      message:"Updated"
    })
  }catch{
    res.status(500).json({
      error:"Database error"
    })
  }
}

exports.delete_hotel = async (req,res)=>{
  try{
    const hotel_id = req.params.id

    if(!ObjectId.isValid(hotel_id)){
      return res.status(400).json({
        error:"Invalid id"
      })
    }

    const result = await hotel_collection().deleteOne({_id: new ObjectId(hotel_id)})

    if (result.deletedCount === 0){
      return res.status(404).json({
        error:"Hotel not found"
      })
    }

    res.status(200).json({
      message:"Deleted"
    })
  }catch{
    res.status(500).json({
      error:"Database error"
    })
  }
}