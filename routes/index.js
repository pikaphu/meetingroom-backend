const router = require('express').Router()

// main
router.get('/', (req, res) => {
    console.log('api');
    res.json({
        message: 'router msg'
    })
})

// route: account
router.use('/account', require('./account.js'))

module.exports = router