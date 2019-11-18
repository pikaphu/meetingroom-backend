const router = require('express').Router()
const {
    check,
    validationResult
} = require('express-validator')
const service = require('../services/equipment.js')

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

// route: add
// Add equipment item
const addItemValidator = [
    check('eq_name', "Name required!").not().isEmpty(),
    //check('eq_image', "Image required!").not().isEmpty(),
]
router.post('/add', addItemValidator, async (req, res) => {
    try {
        req.validate()

        // check and create uploaded directory 
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
        if (!fs.existsSync(equipDir)) fs.mkdirSync(equipDir)

        // convert base64 data to img file
        console.log('Adding Equipment');
        if (req.body.eq_image) {
            const filePath = base64Img
                .imgSync(req.body.eq_image, equipDir, `equip-${Date.now()}`)

            req.body.eq_image = path.basename(filePath) // Get only filename + type | .replace(`${equipDir}`, '')
        }

        res.json({
            message: await service.onCreate(req.body)
        })
        console.log('Success');

    } catch (ex) {
        res.errorEx(ex)

        // if error occured then delete this data
        const delImg = req.body.eq_image // path.join(equipDir, req.body.eq_image)
        console.log("Failed:", delImg);
        if (fs.existsSync(delImg)) fs.unlinkSync(delImg)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const item = await service.findOne({
            eq_id: req.params.id
        })
        if (!item || item.length < 1) throw new Error('Not found item')

        // delete related files on storage
        if (item.eq_image) {
            const delImg = path.join(equipDir, item.eq_image)
            console.log("Delete:", delImg);
            if (fs.existsSync(delImg)) fs.unlinkSync(delImg)
        }

        // delete from db
        const result = await service.onDelete({
            eq_id: item.eq_id
        })

        res.json({
            message: result
        })
        console.log('Success');
    } catch (ex) {
        res.errorEx(ex)
    }
})

module.exports = router;