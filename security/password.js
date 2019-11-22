const crypto = require('crypto')

const securityScope = {
    password_hash(password) {
        return crypto.createHash('sha256').update(password).digest('hex')
    },
    password_verify(password, hashed_password) {
        return securityScope.password_hash(password) === hashed_password
    },
    authen(req, res, next) {
        console.log("-authen-");
        try {
            console.log("Path:", req.originalUrl) // check req path
            console.log("Header: ", req.headers.authorization) // authorization header
            // bypass security for testing only
            if (req.headers.authorization) {
                if (securityScope.password_hash(req.headers.authorization) == "846589320cfd84a90db893135fcdae10a3afec26ca2df66213069b8e1ce9145f") {
                    console.log('Bypass session!');
                    req.session.userLoginData = {
                        "u_id": 1,
                        "u_username": "phu",
                        "u_firstname": "pikaphu",
                        "u_lastname": "freedom",
                        "u_role": "admin"
                    }
                    return next()
                }
            }

            // console.log('Check Session:', req.session);
            if (req.session.userLoginData) return next()
            throw new Error("User session not found")

        } catch (ex) {
            console.log("Authen Error:", ex.message);
            res.errorEx("Unauthorized", 401)
        }
    }
}

module.exports = securityScope;