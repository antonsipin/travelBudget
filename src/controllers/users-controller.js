require('dotenv').config()
const bcrypt = require('bcrypt')
const User = require('../models/user-model')
const salt = process.env.saltRounds || 10

const serializeUser = (user) => {
  return {
    name: user.name,
    id: user.id,
    email: user.email
  }
}

const renderSignUp = (req, res) => {
  res.render('signup')
}

const renderLogIn = (req, res) => {
  res.render('login')
}

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('req.body', name, email, password)
   
    try {
     
if (name && email && password) {
 const hashPass = await bcrypt.hash(password, Number(salt))

      const newUser = new User({
        email,
        name,
        password: hashPass, 
      })


      await newUser.save()
    console.log(newUser)
      req.session.user = serializeUser(newUser)
console.log(serializeUser(newUser))
     
      res.redirect('/account')
    } 
   else {
    res.render('signup', { error: 'Missing Email or Password' })
  }
    } catch (e) {
  
      res.render('signup', { error: 'User not found please try again' })
    }

}

const signIn = async (req, res) => {
  const { email, password } = req.body

  if (email && password) {
    try {
      const user = await User.findOne({ email }).lean()
      if (user) {
        const validPassword = await bcrypt.compare(password, user.password)
        if (validPassword) {
          req.session.user = serializeUser(user)
          res.redirect('/account')
        } else {
          res.render('login', { error: 'Wrong Email or Password' })
        }
      } else {
        res.render('login', { error: 'Wrong Email or Password' })
      }

    } catch (e) {
  
      res.render('login', { error: 'User not found please try again' })
    }

  } else {
    res.render('login', { error: 'Missing Email or Password' })
  }
}

const logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) throw new Error(err)
    res.clearCookie(req.app.get('session cookie name'));
    return res.redirect('/');
  })
}

module.exports = {
  renderSignUp,
  renderLogIn,
  signUp,
  signIn,
  logout
}
