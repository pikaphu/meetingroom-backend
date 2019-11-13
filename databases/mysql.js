const mysql = require('mysql')
const connection = mysql.createPool({
    host: global.myConfig.mysql.host, // process.env.MY_DB_HOST
    user: global.myConfig.mysql.user,
    password: global.myConfig.mysql.user,
    database: global.myConfig.mysql.database,
    charset: global.myConfig.mysql.charset
})

// check conn
connection.getConnection(function (err, connection) {
    if (err !== null) {
        console.log(err.message);
    }
})

module.exports = connection