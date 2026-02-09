const bcrypt = require("bcryptjs")
const user_collection = require("../models/user_model")

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.redirect("/login?error=Invalid%20credentials")
    }

    const users = user_collection()

    const user = await users.findOne({ email })
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

    res.redirect("/")
  } catch (err) {
    console.log(err)
    res.status(500).send("Server Internal Error")
  }
}

exports.register = async (req, res) => {
  try {
    const { user_name, email, password } = req.body

    if (!user_name || !email || !password) {
      return res.redirect("/register?error=Invalid%20credentials")
    }

    const users = user_collection()

    let user = await users.findOne({ user_name: user_name })
    let email_of = await users.findOne({ email: email })
    if (user || email_of) {
      return res.redirect("/register?error=Invalid%20credentials")
    }

    const hashed_password = await bcrypt.hash(password, 12)

    await users.insertOne({ user_name, email, password: hashed_password, role: "user" })
    res.redirect("/login?success=Registration%20successfully%20done")
  } catch(err) {
    console.log(err)
    res.status(500).send("Server Internal Error")
  }
}

exports.logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) throw err
      res.redirect("/login")
    })
  } catch {
    res.status(500).send("Server Internal Error")
  }
}