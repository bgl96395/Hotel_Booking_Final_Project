require('dotenv').config()
const express = require('express')
const session = require('express-session')
const path = require('path')
const { connect_DB } = require('./config/database')
const auth_middleware = require('./middleware/auth_middleware')
const session_config = require("./config/session")
const fs = require("fs")

const app = express()

connect_DB()

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session(session_config))

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.use(require('./routes/auth_route'))
app.use(require('./routes/hotel_route'))

app.get('/', auth_middleware, (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})
app.get('/about', auth_middleware, (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'))
})
app.get('/contact', auth_middleware, (req, res) => {
  res.sendFile(path.join(__dirname, '/views/contact.html'))
})
app.get('/hotels', auth_middleware, (req, res) => {
  res.sendFile(path.join(__dirname, '/views/hotels.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login.html'))
})
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/register.html'))
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
  res.send("Your contacts was saved")
})

app.get('/api/user', (req, res) => {
  if (req.session.user && req.session.user.role) {
    res.json({ role: req.session.user.role })
  } else {
    res.json({ role: null })
  }
})

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '/views/404.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})