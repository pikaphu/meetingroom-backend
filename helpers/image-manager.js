const base64Img = require('base64-img')
const fs = require('fs')
const path = require('path')
const ftp = require("basic-ftp")

const ftpClient = new ftp.Client()
const uploadDirName = 'uploads'
const uploadDir = path.resolve(uploadDirName)
var ftpUploadDir = `/${uploadDirName}/`
ftpClient.ftp.verbose = false

// #region --- Image Files Manager ---
const imageManager = {
    async convertB64AndUploadImg(imgB64, targetDir, targetFile) {
        // convert base64 data to img file + save to physical disk + get its name
        const img = this.convertBase64ToImg(imgB64, targetDir, targetFile)
        if (img == null) {
            throw new Error('Image convert failed!')
        }

        // upload file
        const uploadStatus = await this.ftpUploadImg(img, targetDir)
        if (!uploadStatus) {
            throw new Error('Cannot upload Image')
        }

        return img
    },

    // convert base64 data to image file and save to disk
    convertBase64ToImg(imgB64, targetDir, targetFile) {
        // check and create uploaded directory 
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
        const tempDir = path.join(uploadDir, targetDir)
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

        if (imgB64) {
            const filePath = base64Img
                .imgSync(imgB64, tempDir, `${targetFile}${Date.now()}`)

            return path.basename(filePath) // return filename + type | .replace(`${roomDir}`, '')
        }
        return null
    },

    // upload img to ftp server and delete img (on disk)
    async ftpUploadImg(img, targetDir) {
        // using FTP to manage files
        console.log('ftp uploading...');

        // 0. prepare    
        let isUploaded = false
        const imgPath = path.join(uploadDir, targetDir, img)
        try {
            // 1. connect
            await ftpClient.access({
                host: global.myConfig.ftp.host,
                user: global.myConfig.ftp.user,
                password: global.myConfig.ftp.password,
                secure: false
            })

            // 2. check uploading dir and create if not exist
            const ftpTargetDir = `/${ftpUploadDir}/${targetDir}`
            const ftpTargetPath = `/${ftpTargetDir}/${img}`

            console.log('PATH1:', ftpTargetDir);
            console.log('PATH2:', ftpTargetPath);
            console.log('PATH3:', imgPath);

            await ftpClient.ensureDir(ftpTargetDir)

            // 3. try upload file                
            const temp = await ftpClient.uploadFrom(imgPath, ftpTargetPath) // passive mode

            // 4. success
            console.log('Upload success!', temp)
            isUploaded = true

        } catch (err) {
            console.log(err)
        }
        ftpClient.close()

        // delete img (on disk) even upload fail or success
        this.deleteTempImg(img, targetDir)

        return isUploaded
    },

    // delete image on disk
    deleteTempImg(img, targetDir) { // only name + ext
        img = path.join(targetDir, img)
        console.log("DeleteImg:", img);
        if (fs.existsSync(img)) fs.unlinkSync(img)
    },

    // delete img on ftp server 
    async ftpDeleteImg(img, targetDir) {
        // ftp delete on server
        console.log('ftp deleting');

        // 0. prepare    
        let isDeleted = false
        const imgPath = path.join(targetDir, img)
        try {
            // 1. connect
            await ftpClient.access({
                host: global.myConfig.ftp.host,
                user: global.myConfig.ftp.user,
                password: global.myConfig.ftp.password,
                secure: false
            })

            // 2. check uploading dir and create if not exist
            await ftpClient.ensureDir(ftpUploadDir)

            // 3. try upload file                
            const temp = await ftpClient.remove(`${ftpUploadDir}/${img}`) // passive mode

            // 4. success
            console.log('Delete success!', temp)
            isDeleted = true

        } catch (err) {
            console.log(err)
        }
        ftpClient.close()

        return isDeleted
    }

}

module.exports = imageManager;
// #endregion