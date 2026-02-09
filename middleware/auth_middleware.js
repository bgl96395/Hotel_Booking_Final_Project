module.exports = (req, res, next) => {
  if (req.session.middleware) {
    next()
  } else {
    res.redirect("/login")
  }
}