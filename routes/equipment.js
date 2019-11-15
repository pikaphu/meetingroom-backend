const router = require('express').Router()

router.get('/data', (req, res) => {
    console.log('Equipment Data');
    res.json({
        message: "Equipment Data"
    })
})


module.exports = router;