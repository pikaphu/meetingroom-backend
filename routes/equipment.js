// #region Import
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

// #endregion

router.get('/', (req, res) => {
    res.json({
        message: "Equipment"
    })
})

// route: ADD
// Create equipment item
const addItemValidator = [
    check('eq_name', "Name required!").not().isEmpty(),
    //check('eq_image', "Image required!").not().isEmpty(),
]
router.post('/add', addItemValidator, async (req, res) => {
    try {
        req.validate()

        // convert base64 data to img file
        console.log('Adding Equipment');

        // upload file and get name
        req.body.eq_image = uploadImgBase64(req.body.eq_image)

        // Add item data
        const result = await service.onCreate(req.body)

        // response result
        res.json({
            message: result
        })

        console.log('Success');

    } catch (ex) {
        res.errorEx(ex)

        // if error occured then delete this data
        deleteImg(req.body.eq_image)
    }
})

// route: UPDATE
router.put('/:id', async (req, res) => {
    try {
        const item = await service.findOne({
            eq_id: req.params.id
        })
        if (!item || item.length < 1) throw new Error('Not found item')

        // update from db
        const result = await service.onUpdate(item.eq_id, req.body)

        // #unused #deprecated
        // if update effected, delete its resources 
        // if (result.affectedRows > 0) {
        //     deleteImg(item.eq_image)
        // }

        // response result
        res.json({
            message: result
        })
        console.log('Success');
    } catch (ex) {
        res.errorEx(ex)
    }
})

// route: DELETE
router.delete('/:id', async (req, res) => {
    try {
        const item = await service.findOne({
            eq_id: req.params.id
        })
        if (!item || item.length < 1) throw new Error('Not found item')

        // delete from db 
        const result = await service.onDelete({
            eq_id: item.eq_id
        })

        // delete related files on storage
        deleteImg(item.eq_image)

        // response result
        res.json({
            message: result
        })
        console.log('Success');
    } catch (ex) {
        res.errorEx(ex)
    }
})

// #region Image Files Manager
// upload image
function uploadImgBase64(imgB64) {
    // check and create uploaded directory 
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
    if (!fs.existsSync(equipDir)) fs.mkdirSync(equipDir)

    if (imgB64) {
        const filePath = base64Img
            .imgSync(imgB64, equipDir, `equip-${Date.now()}`)

        return path.basename(filePath) //returnfilename + type | .replace(`${equipDir}`, '')
    }
    return null
}

// delete image
function deleteImg(img) { // only name + ext
    img = path.join(equipDir, img)
    console.log("DeleteImg:", img);
    if (fs.existsSync(img)) fs.unlinkSync(img)
}
// #endregion

module.exports = router;