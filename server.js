require('dotenv').config()
const express = require('express')
const app = express()
const fs = require('fs')
const { MongoClient } = require("mongodb")
const session = require("express-session")
const MongoStore = require('connect-mongo').default;  
const bcrypt = require("bcryptjs")

const middleware = (req, res, next) => {
  if (req.session.middleware) {
    next()
  } else {
    res.redirect("/login")
  }
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecret', // Лучше использовать из .env
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,     
    collectionName: 'sessions'           
  }),
  cookie: { 
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // ← ЭТО ВАЖНО!
    maxAge: 1000 * 60 * 60 * 24       
  }
}));

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.post('/contact', (req, res) => {
  const data = {
    Firstname: req.body.fname,
    Lastname: req.body.lname,
    Email: req.body.email,
    Message: req.body.comments
  }

  fs.writeFile('Form_data.json', JSON.stringify(data, null, 2), 'utf-8', (err) => {
    if (err) {
      console.error(err)
    }
  })

  res.send(`<h2 style="text-align:center;margin-top:100px">Thanks, "${req.body.fname} ${req.body.lname}" ! Your message has been received.</h2>`)
})

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html")
})
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/views/register.html")
})
app.get('/', middleware, (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})
app.get('/about', middleware, (req, res) => {
  res.sendFile(__dirname + '/views/about.html')
})
app.get('/contact', middleware, (req, res) => {
  res.sendFile(__dirname + '/views/contact.html')
})
app.get('/hotels', middleware, (req, res) => {
  res.sendFile(__dirname + '/views/hotels.html')
})

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL

const client = new MongoClient(MONGO_URL)

async function MongoDB_connect() {
  try {
    await client.connect()
    console.log("MongoDB connected")
  } catch (e) {
    console.log("Error: ", e)
  }
}
MongoDB_connect()

const database = client.db("HotelBook")
const collection = database.collection("hotels")
const user_collection = database.collection("users")

const hotel_route = require("./routes/routes")
const hotel_handler = require("./handlers/hotels_handler")

hotel_handler.set_collection(collection)

app.use(hotel_route)

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.redirect("/login?error=Invalid%20credentials")
    }

    const user = await user_collection.findOne({ email })
    if (!user) {
      return res.redirect("/login?error=Invalid%20credentials")
    }

    const is_match = await bcrypt.compare(password, user.password)

    if (!is_match) {
      return res.redirect("/login?error=Invalid%20credentials")
    }

    req.session.user = {
      id: user._id,
      user_name: user.user_name,
      role: user.role
    }

    req.session.middleware = true

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err)
        return res.status(500).send("Server Internal Error")
      }
      res.redirect("/")
    })
  } catch (err) {
    console.error(err)
    res.status(500).send("Server Internal Error")
  }
})

app.post("/register", async (req, res) => {
  try {
    const { user_name, email, password } = req.body

    if (!user_name || !email || !password) {
      return res.redirect("/register?error=Invalid%20credentials")
    }

    let user = await user_collection.findOne({ user_name: user_name })
    let email_of = await user_collection.findOne({ email: email })
    if (user || email_of) {
      return res.redirect("/register?error=Invalid%20credentials")
    }

    const hashed_password = await bcrypt.hash(password, 12)

    await user_collection.insertOne({ user_name, email, password: hashed_password, role: "user" })
    res.redirect("/login?success=Registration%20successfully%20done")
  } catch {
    res.status(500).send("Server Internal Error")
  }
})

app.post("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) throw err
      res.redirect("/login")
    })
  } catch {
    res.status(500).send("Server Internal Error")
  }
})

app.get('/api/user', (req, res) => {
  if (req.session.user && req.session.user.role) {
    res.json({ role: req.session.user.role })
  } else {
    res.json({ role: null })
  }
})

app.use((req, res) => {
  res.status(404).sendFile(__dirname + '/views/404.html')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})