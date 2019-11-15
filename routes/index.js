const router = require('express').Router()
const {
    authen
} = require('../security/password.js')

// main route
router.get('/', (req, res) => {
    console.log('route api');
    res.json({
        message: 'router msg'
    })
})

// route: account
router.use('/account', require('./account.js'))

// route: equipment
router.use('/equipment', authen, require('./equipment.js'))


module.exports = router