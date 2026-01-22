require('dotenv').config()
const express = require('express')
const app = express()
const fs = require('fs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const {Client} = require('pg')

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
});

app.post('/contact', (req, res) => {
  const data = { Firstname: req.body.fname , Lastname: req.body.lname , Email: req.body.email , Message: req.body.comments}
  
  fs.writeFile('Form_data.json',JSON.stringify(data, null, 2),'utf-8',(err) => {
    if (err) {
      console.error(err)
    }})
  
  res.send(`<h2 style="text-align:center;margin-top:100px">Thanks, "${req.body.fname} ${req.body.lname}" ! Your message has been received.</h2>`)
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})
app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html')
})
app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/views/contact.html')
})
app.get('/hotels',(req,res)=>{
  res.sendFile(__dirname + '/views/hotels.html')
})


app.get('/search', (req,res) => {
  let q = req.query.q
  if (q === "about"){
    res.sendFile(__dirname + '/views/about.html')
  }
  else if (q === "home"){
    res.sendFile(__dirname + '/views/index.html')
  }
  else if (q === "contact"){
    res.sendFile(__dirname + '/views/contact.html')
  }else if(q === "hotels"){
    res.sendFile(__dirname + "/views/hotels.html")
  }
  else{
    res.status(400).send("Bad request!")
  }
})

app.get('/api/info',(req,res) =>{
  res.json({
    application: "Hotel Booking web Applicication",
    team_members: "Asylbek, Ansar, Dinmuhamed, Bigali",
    features_used: "express.js , node.js"
  })
})

//MongoDB integration
const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL

const {MongoClient,ObjectId} = require("mongodb")

let hotels
MongoClient.connect(MONGO_URL).then(
    client=>{
        console.log("MongoDB connected")
        const db = client.db("HotelBook")
        hotels = db.collection("hotels")
        app.listen(PORT,()=>console.log("Server running on port http://localhost:3000"))
    }
)

app.get("/api/hotels", async (req,res)=>{
    const { country, minPrice, sort, fields } = req.query

  let filter = {}
  if (country) {
    filter.country = country
  }

  if (minPrice) {
    const min_price = Number(minPrice)
    if (isNaN(min_price)) {
      return res.status(400).json({
        error: "Invalid minPrice",
      });
    }
    filter.price_per_night = { $gte: min_price }
  }

  let sorting = {};
  if (sort) {
    if (sort === "price") {
      sorting.price_per_night = 1;
    } else if (sort === "priceDesc") {
      sorting.price_per_night = -1;
    } else {
      return res.status(400).json({
        error: "Invalid sort value",
      });
    }
  }

  let chosen_fields = {}
  if (fields) {
    const displaying_fields = fields.split(",")
    for (let i = 0; i < displaying_fields.length; i++) {
      let field = displaying_fields[i]
      chosen_fields[field] = 1
    }
  }

  try {
    let filtered_hotels = hotels.find(filter)

    if (Object.keys(sorting).length > 0) {
      filtered_hotels = filtered_hotels.sort(sorting)
    }

    if (Object.keys(chosen_fields).length > 0) {
      filtered_hotels = filtered_hotels.project(chosen_fields)
    }

    const list = await filtered_hotels.toArray()

    res.status(200).json({
        count: list.length,
        hotels: list,
    })
  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }  
})

app.get("/api/hotels/:id", async (req,res)=>{
    const hotel_id = req.params.id
    if(!ObjectId.isValid(hotel_id)){
        return res.status(400).json({
            error:"Invalid id"
        })
    }
    const hotel = await hotels.findOne({_id: new ObjectId(hotel_id)})
    if (!hotel){
        return res.status(404).json({
            error:"Hotel not found"
        })
    }
    res.status(200).json(hotel)
})

app.post("/api/hotels",async(req,res)=>{
    const {name,price_per_night,country} = req.body
    if (!name || typeof price_per_night !== "number" || !country){
        return res.status(400).json({
            error:"Missing or invalid fields"
        })
    }
    await hotels.insertOne({name,price_per_night,country})
    res.status(201).json({
        message:"Product created"
    })
})


app.put("/api/hotels/:id", async (req,res)=>{
  const hotel_id = req.params.id
  const {name,price_per_night,country} = req.body

  if(!ObjectId.isValid(hotel_id)){
    return res.status(400).json({
      error:"Invalid id"
    })
  }

  if (!name && !price_per_night && !country){
    return res.status(400).json({
      error:"No fields to update"
    })
  }

  let updating_fields={}
  if(name){
    updating_fields.name=name
  }
  if(typeof price_per_night ==="number"){
    updating_fields.price_per_night=price_per_night
  }
  if(country){
    updating_fields.country=country
  }

  const result = await hotels.updateOne(
    {_id: new ObjectId(hotel_id)},
    {$set: updating_fields}
  )

  if(result.matchedCount===0){
    return res.status(404).json({
      error:"Hotel not found"
    })
  }
  
  res.status(200).json({
    message:"Updated"
  })
})

app.delete("/api/hotels/:id", async (req,res)=>{
  const hotel_id = req.params.id

  if(!ObjectId.isValid(hotel_id)){
    return res.status(400).json({
      error:"Invalid id"
    })
  }

  const result = await hotels.deleteOne({_id: new ObjectId(hotel_id)})

  if (result.deletedCount === 0){
    return res.status(404).json({
      error:"Hotel not found"
    })
  }

  res.status(200).json({
    message:"Deleted"
  })
})


// handling unknown pages
app.use((req, res) => {
  res.status(404).sendFile(__dirname + '/views/404.html')
})

