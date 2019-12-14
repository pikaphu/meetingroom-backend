// #region Setup Dependencies
const router = require('express').Router()
const {
    check,
    query,
    validationResult
} = require('express-validator')
const service = require('../services/room.js')

const imgMng = require('../helpers/image-manager.js')
const path = require('path')
const imgFTPDir = 'rooms'
const imgFTPFile = 'room-'

// #endregion

// route: home
const homeValidator = [
    query('page').not().isEmpty().isInt().toInt() // 0=isEmpty(), 1=isInt()
]
router.get('/', async (req, res) => {
    try {
        req.validate()

        const data = await service.list(req.query)
        res.json(data)
    } catch (ex) {
        res.errorEx(ex)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const data = await service.findOne({
            eq_id: req.params.id
        })
        if (!data) throw new Error('Not found room.');

        //convert img file to base64 data
        const imgPath = global.myConfig.content.url + path.join(ftpUploadDir, data.eq_image)
        data.eq_image = imgPath
        res.json(data)

    } catch (ex) {
        res.errorEx(ex)
    }
})

// route: ADD
// Create New Room
const addItemValidator = [
    check('r_name', "Name required!").not().isEmpty(),
    check('r_capacity', "Capacity required!").not().isEmpty().isInt(),
    //check('r_image', "Image required!").not().isEmpty(),
]
router.post('/add', addItemValidator, async (req, res) => {
    console.log('+Room->Add');

    try {
        req.validate()

        // convert base64 data to img file and upload
        req.body.r_image = await imgMng.convertB64AndUploadImg(req.body.r_image, imgFTPDir, imgFTPFile)

        // Add item data
        const result = await service.onCreate(req.body)

        // response result
        res.json({
            message: result
        })

        console.log('Add Success');

    } catch (ex) {
        res.errorEx(ex)

        // if error occured then delete this data
        deleteTempImg(req.body.r_image)
        ftpDeleteImg(req.body.r_image)
    }
})

// route: UPDATE
router.put('/:id', async (req, res) => {
    console.log('+Room->Update');

    try {
        const item = await service.findOne({
            eq_id: req.params.id
        })
        if (!item || item.length < 1) throw new Error('Not found item')

        // convert to img and upload
        req.body.r_image = await convertB64AndUploadImg(req.body.r_image)

        // update from db
        const result = await service.onUpdate(item.eq_id, req.body)

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
        console.log('+Room->Delete');

        const item = await service.findOne({
            eq_id: req.params.id
        })
        if (!item || item.length < 1) throw new Error('Not found item')

        // delete from db 
        const result = await service.onDelete({
            eq_id: item.eq_id
        })

        // deleteImg(item.eq_image) // delete on storage
        ftpDeleteImg(item.eq_image) // delete on ftp server

        // response result
        res.json({
            message: result
        })
        console.log('Success');
    } catch (ex) {
        res.errorEx(ex)
    }
})


module.exports = router;