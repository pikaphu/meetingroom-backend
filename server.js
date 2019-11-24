// 0. load config
require('./config/config.js')

// 1. framework setup
const express = require('express')
const app = express()
const PORT = global.myConfig.server_port || 3000

// #region --- CORS ORIGIN ----
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS')
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

var cors = require('cors') // cors origin
//app.use(cors()) // allow pre-flight, options
var corsConfig = {
    //origin: 'http://localhost:8080', // only whitelist
    origin: true, // allow origin
    credentials: true, // allow to send cookies 
}
app.use(cors(corsConfig)) // set config
app.options('*', cors(corsConfig)) // allow OPTIONS, pre-flight to all origin "*"
// #endregion

const bodyParser = require('body-parser')
const session = require('express-session')
const {
    check,
    validationResult
} = require('express-validator')
// express http options (request, response)
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '10MB' // limit upload size
}))
app.use(bodyParser.json())

// session 
app.use(session({
    secret: process.env.SESSION_SECRET || "secret", // for test only | need more complex security on production deployment.
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
}))

// Local contents
// app.use('/api/uploads', express.static(`${__dirname}/uploads/equipments`));

// 2. middleware
app.use(require('./middlewares/validator.js'))

// 3. Router
const router = require('./routes/api.js') // main routes
app.use('/api', router)

app.get('/session', (req, res) => {
    res.end('session created:', req.session.item)
})
/*
app.get('*', function (req, res) {
    //res.write(`<h1>${req.session.item} </h1>`)
    res.end()
    //res.json({message: 'api test'})
})
*/

// (optional) My Tester
// app.use('/test', require('./test/phutest1.js'))

// Final. start server
app.listen(PORT, () =>
    console.log('Server is listening at port:', PORT))