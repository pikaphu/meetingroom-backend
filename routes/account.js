const router = require('express').Router()

const {
    check,
    validationResult
} = require('express-validator')
const {
    onRegister,
    onLogin
} = require('../services/account.js')

const {
    authen
} = require('../security/password.js')

// route: register
const registerValidator = [
    check('u_username', "username required!").not().isEmpty(),
    check('u_password', "password required!").not().isEmpty(),
    check('u_firstname', "Please enter firstname").not().isEmpty(),
    check('u_lastname', "Please enter lastname").not().isEmpty()
]
router.post('/register', registerValidator, async (req, res) => {
    console.table(req.body);
    try {
        req.validate();
        const result = await onRegister(req.body)
        res.json(result)
    } catch (ex) {
        res.errorEx(ex)
    }
    // res.setHeader('Content-Type', 'text/plain')
    // res.end(JSON.stringify(req.body, null, 2))
    res.end()
})

// route: login
const loginValidator = [
    check('u_username', "username required!").not().isEmpty(),
    check('u_password', "password required!").not().isEmpty()
]
router.post('/login', loginValidator, async (req, res) => {
    console.table(req.body);
    try {
        req.validate();
        const userLoginData = await onLogin(req.body)
        console.table(userLoginData)

        req.session.userLoginData = userLoginData
        return res.json(userLoginData)
    } catch (ex) {
        res.errorEx(ex)
    }
})

// route: Get user login session
router.get('/getuserlogin', authen, (req, res) => {
    try {
        console.log('UserLogin:');
        console.table(req.session.userLoginData);
        return res.json(req.session.userLoginData); // require authen() first

    } catch (ex) {
        res.errorEx(ex, 401) // unauthorized
    }

})

// route: logout
router.get('/logout', (req, res) => {
    console.log('Logout');
    try {
        delete req.session.userLoginData
        res.json({
            message: 'Logged out success'
        })
    } catch (ex) {
        res.errorEx(ex)
    }
})


module.exports = router