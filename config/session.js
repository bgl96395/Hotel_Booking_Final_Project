module.exports = ({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,          
  cookie: { 
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24       
  }
})