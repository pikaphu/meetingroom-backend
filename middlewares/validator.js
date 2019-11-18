// Middleware

const {
    check,
    validationResult
} = require('express-validator')

module.exports = function (req, res, next) {
    req.validate = function () {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log('Error!', errors);
            //console.log(errors.array());
            //throw new Error(`${errors[0].param} : ${errors[0].msg}`)
            throw errors.array()
        }
    }

    res.errorEx = function (ex, status = 400) {
        console.log("ErrorEX!\n");
        if (Array.isArray(ex)) {
            // Array             
            console.table(ex);
            res.status(status).json({
                message: ex // ex.array()
            })
        } else {
            // string only
            res.status(status).json({
                message: ex.message || ex
            })
        }

    }

    res.errorExJSON = function (ex, status = 422) {
        res.status(status).json({
            message: ex.array()
        })
    }

    next()
}