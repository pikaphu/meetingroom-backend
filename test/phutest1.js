const mytest1 = require('../security/password.js')

const express = require('express')
const app = express()

app.get('/password/:id', (req, res) => {
    res.send(mytest1.password_hash(req.params.id))
})

app.get('/ftp', async () => {
    // using FTP to manage files
    const ftp = require("basic-ftp")
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: process.env.MY_FTP_HOST,
            user: process.env.MY_FTP_USER,
            password: process.env.MY_FTP_PASS,
            secure: false
        })
        console.table(await client.list())
        //await client.uploadFrom("README.md", "README_FTP.md") // passive mode
        //await client.downloadTo("README_COPY.md", "README_FTP.md") // passive mode
    } catch (err) {
        console.log(err)
    }
    client.close()
})


app.listen(3456, () => {
    console.log('Start Test server at port 3456.')
})