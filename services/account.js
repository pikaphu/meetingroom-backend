const db = require('../databases/mysql.js')
const {
    password_hash,
    password_verify
} = require('../security/password.js')


function onRegister(value) {
    return new Promise((resolve, reject) => {
        //console.log('onRegister', value);
        value.u_password = password_hash(value.u_password)
        db.query('INSERT INTO tb_users SET ?', value, (error, result) => {
            if (error) return reject(error)
            resolve(result)
        })
    })
}

function onLogin(value) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tb_users WHERE u_username=?', [value.u_username], (error, result) => {
            if (error) return reject(error)
            if (result.length > 0) {
                const userLoginData = result[0]
                if (password_verify(value.u_password, userLoginData.u_password)) {
                    delete userLoginData.u_password
                    delete userLoginData.u_created
                    delete userLoginData.u_updated
                    resolve(userLoginData)
                } else {
                    reject(new Error('Invalid username or password'))
                }
            }
        })
    })
}

module.exports = {
    onLogin,
    onRegister
}