const bcrypt = require("bcryptjs")
const user_collection = require("../models/user_model")
const {body, validationResult} = require("express-validator")

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
      id: user._id.toHexString(),
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

exports.registerValidators = [
  body('user_name').isLength({ min: 3 }).withMessage('User name must be at least 3 characters'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters')
]
exports.register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const message = errors.array().map(err => err.msg).join(', ')
      return res.redirect(`/register?error=${encodeURIComponent(message)}`)
    }
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
