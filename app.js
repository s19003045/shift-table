const express = require('express')
const app = express()

// 判別開發環境
if (process.env.NODE_ENV !== 'production') {      // 如果不是 production 模式
  require('dotenv').config()                      // 使用 dotenv 讀取 .env 檔案
}

const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

// const db = require('./models')
// const User = db.User
// const Record = db.Record


const methodOverride = require('method-override')
const handlebars = require('handlebars')

// import passport
const passport = require('passport')
// import express-session
const session = require('express-session')
// import connect-flash
const flash = require('connect-flash')


// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// Set body-parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// static files
app.use(express.static('public'))

// Set up template engine 
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set session
// ※注意：app.use(session({})) 必須設定在 app.use(passport.session()) 之前
app.use(session({
  secret: 'hello world', //用來簽章 sessionID 的cookie, 可以是一secret字串或是多個secret組成的一個陣列
  resave: false,
  saveUninitialized: true,
}))

// 建立 flash 實例並使用它
app.use(flash())

// passport initialize
app.use(passport.initialize())

// 如果應用程式使用 passport 來驗證使用者，並且會持續用到 login session，則必須使用 passport.session() 這個 middleware
app.use(passport.session())

// 載入 config 中的 passport.js
// 把上面宣告的 passport 實例當成下面的參數
// require('./config/passport')(passport)

// 登入後可以取得使用者的資訊方便我們在 view 裡面直接使用
app.use((req, res, next) => {

  // 將驗證成功之後產生的 req.user 及 .isAuthenticated 存進 res.locals。
  // res.locals 的變數可使用在 routes、渲染 view
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()

  // 可用在使用者註冊/登入/登出時，儲存 success_msg 及 failure_msg
  res.locals.success_msg = req.flash('success_msg')
  res.locals.failure_msg = req.flash('failure_msg')

  next()
})



// handlebars helper
handlebars.registerHelper("ifEquals", function (v1, v2, options) {
  return v1 === v2 ? options.fn(this) : options.inverse(this);
})

// ===============route setting=============

// app.use('/', require('./routes/home'));

// app.get('/', (req, res) => {
//   res.redirect('https://www.google.com')
// })

// app.use('/records', require('./routes/records'))

// app.use('/user', require('./routes/user'))

// app.use('/auth', require('./routes/auth'))

// app.use('/analysis', require('./routes/analysis'))

// Server start
app.listen(process.env.PORT || port, () => {
  console.log(`Express server start`)
})


