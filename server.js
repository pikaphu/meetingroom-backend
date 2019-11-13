// 0. load config
require('./config/config.js')

// 1. framework setup
const express = require('express')
const app = express()
const PORT = global.myConfig.server_port || 3000
const bodyParser = require('body-parser')
const session = require('express-session')
const {
    check,
    validationResult
} = require('express-validator')

var cors = require('cors') // cors origin
app.use(cors())

// express http options (request, response)
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

// session 
app.use(session({
    secret: process.env.SESSION_SECRET || "secret", // for test only | need more complex security
    resave: false,
    saveUninitialized: false,
    cookie: {}
}))

// 2. middleware
app.use(require('./middlewares/validator.js'))

// 3. Router
const router = require('./routes/index.js') // main routes
app.use('/api', router)

app.get('/session', (req, res) => {
    res.end('session created:', req.session.item)
})

app.get('*', function (req, res) {
    res.write(`<h1>Session: ${req.session.item} </h1>`)
    res.end()
    //res.json({message: 'api test'})
})

// Final. start server
app.listen(PORT, () =>
    console.log('Server is listening at port:', PORT))