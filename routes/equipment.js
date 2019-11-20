// #region Import
const router = require('express').Router()
const {
    check,
    query,
    validationResult
} = require('express-validator')
const service = require('../services/equipment.js')

const base64Img = require('base64-img')
const fs = require('fs')
const path = require('path')

const uploadDirName = 'uploads'
const equipDirName = 'equipments'
const uploadDir = path.resolve(uploadDirName)
const equipDir = path.join(uploadDir, equipDirName)
const ftpUploadDir = `/${uploadDirName}/${equipDirName}`

// #endregion

// route: home
const homeValidator = [
    query('page').not().isEmpty().isInt().toInt() // 0=isEmpty(), 1=isInt()
]
router.get('/', homeValidator, async (req, res) => {
    try {
        req.validate()

        const data = await service.list(req.query)
        res.json(data)
    } catch (ex) {
        res.errorEx(ex)
    }
})

// route: ADD
// Create equipment item
const addItemValidator = [
    check('eq_name', "Name required!").not().isEmpty(),
    //check('eq_image', "Image required!").not().isEmpty(),
]
router.post('/add', addItemValidator, async (req, res) => {
    console.log('+Equipment->Add');

    try {
        req.validate()

        // convert base64 data to img file and get its name
        // req.body.eq_image = convertBase64ToImg(req.body.eq_image)
        const img = convertBase64ToImg(req.body.eq_image)
        req.body.eq_image = img

        // upload file
        const uploadStatus = await ftpUploadImg(img)
        if (!uploadStatus) {
            throw new Error('Cannot upload Image')
        }

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
        deleteImg(req.body.eq_image)
    }
})

// route: UPDATE
router.put('/:id', async (req, res) => {
    console.log('+Equipment->Update');

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
        console.log('+Equipment->Delete');

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
// convert base64 data to image and save to physical disk
function convertBase64ToImg(imgB64) {
    // check and create uploaded directory 
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
    if (!fs.existsSync(equipDir)) fs.mkdirSync(equipDir)

    if (imgB64) {
        const filePath = base64Img
            .imgSync(imgB64, equipDir, `equip-${Date.now()}`)

        return path.basename(filePath) // return filename + type | .replace(`${equipDir}`, '')
    }
    return null
}

// delete image
function deleteImg(img) { // only name + ext
    img = path.join(equipDir, img)
    console.log("DeleteImg:", img);
    if (fs.existsSync(img)) fs.unlinkSync(img)
}

// upload img to ftp server and delete img (on disk)
async function ftpUploadImg(img) {
    // using FTP to manage files
    console.log('ftp uploading');

    // 0. prepare    
    let isUploaded = false
    const imgPath = path.join(equipDir, img)
    const ftp = require("basic-ftp")
    const client = new ftp.Client()
    client.ftp.verbose = false
    try {
        // 1. connect
        await client.access({
            host: global.myConfig.ftp.host,
            user: global.myConfig.ftp.user,
            password: global.myConfig.ftp.password,
            secure: false
        })

        // 2. check uploading dir and create if not exist
        await client.ensureDir(ftpUploadDir)

        // 3. try upload file                
        const temp = await client.uploadFrom(imgPath, `${ftpUploadDir}/${img}`) // passive mode

        // 4. success
        console.log('Upload success!', temp)
        isUploaded = true

    } catch (err) {
        console.log(err)
    }
    client.close()

    // delete img (on disk) even upload fail or success
    deleteImg(img)

    return isUploaded
}

// #endregion

module.exports = router;