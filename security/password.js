const crypto = require('crypto')

const securityScope = {
    password_hash(password) {
        return crypto.createHash('sha256').update(password).digest('hex')
    },
    password_verify(password, hashed_password) {
        return securityScope.password_hash(password) === hashed_password
    },
    authen(req, res, next) {
        try {
            if (req.session.userLoginData) return next()
            throw new Error("User session not found")
        } catch (ex) {
            console.log("Authen Error:", ex.message);
            res.errorEx("Unauthorized", 401)
        }
    }
}


module.exports = securityScope;