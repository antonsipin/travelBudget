require('dotenv').config()
const express = require('express')
const createError = require('http-errors');
const sessionFileStore = require('session-file-store')
const logger = require('morgan');
const methodOverride = require('method-override')
const session = require('express-session')
const app = express()
const path = require('path')
const hbs = require('hbs')
const indexRoute = require('./src/routes/index')
const usersRoute = require('./src/routes/users')
const accountRoute = require('./src/routes/account')
const newtripRoute = require('./src/routes/newtrip')
const dbConnect = require('./src/config/db')
const userMiddle = require('./src/middleware/user')
const mailRoute = require('./src/routes/mail')
const fs = require('fs')

const PORT = process.env.PORT || 3000
dbConnect()

app.set('session cookie name', 'sid')
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src', 'views'))
hbs.registerPartials(path.join(__dirname, 'src', 'views', 'partials'))
hbs.registerHelper('htmlTemplate', (name) => {
  const template = fs.readFileSync(`./src/views/${name}.hbs`, 'utf8')
  return template;
})
app.use(logger('dev'));
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.set('trust proxy', 1);

const FileStore = sessionFileStore(session) 
app.use(session({
  name: app.get('session cookie name'),
  secret: process.env.SESSION_SECRET,
  store: new FileStore({
    secret: process.env.SESSION_SECRET,
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24
  },
})); 

app.use(methodOverride('_method'))

app.use(userMiddle.userName)
app.use('/', indexRoute)
app.use('/users', usersRoute)
app.use('/account', userMiddle.isAuth, accountRoute)
app.use('/newtrip', userMiddle.isAuth, newtripRoute)
app.use('/mail', mailRoute)

app.use(function (req, res, next) {
  res.render('404')
});

app.listen(PORT, () => {
  console.log('Server has been started on port: ', PORT)
})

module.exports = app;
