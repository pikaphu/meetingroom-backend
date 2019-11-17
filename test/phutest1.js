const mytest1 = require('../security/password.js')

const express = require('express')
const app = express()

app.get('/test/:id', (req, res) => {
    res.send(mytest1.password_hash(req.params.id))
})

app.listen(3456, () => {
    console.log('Start Test server at port 3456.')
})