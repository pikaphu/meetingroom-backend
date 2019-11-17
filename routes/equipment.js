const router = require('express').Router()

const base64Img = require('base64-img')
const fs = require('fs')
const path = require('path')
const uploadDir = path.resolve('uploads')
const equipDir = path.join(uploadDir, 'equipments')

router.get('/', (req, res) => {
    res.json({
        message: "Equipment"
    })
})

// Add equipment item
router.post('/add', (req, res) => {
    try {
        // check and create uploaded directory 
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
        if (!fs.existsSync(equipDir)) fs.mkdirSync(equipDir)

        // convert base64 data to img file
        console.log('Equipment Added!');
        const filename = base64Img.imgSync(req.body.eq_image, equipDir, `equip-${Date.now()}`)
        res.json({
            message: filename.replace(`${equipDir}/`, '')
        })

    } catch (ex) {
        res.errorEx(ex)
    }
})


module.exports = router;