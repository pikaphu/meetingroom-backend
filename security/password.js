const crypto = require('crypto')

const securityScope = {
    password_hash(password) {
        return crypto.createHash('sha256').update(password).digest('hex')
    },
    password_verify(password, hashed_password) {
        return securityScope.password_hash(password) === hashed_password
    }
}


module.exports = securityScope;