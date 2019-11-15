const mysql = require('mysql')

const connection = mysql.createPool({
    host: global.myConfig.mysql.host,
    user: global.myConfig.mysql.user,
    password: global.myConfig.mysql.user,
    database: global.myConfig.mysql.database,
    charset: global.myConfig.mysql.charset
})

// check conn
connection.getConnection(function (err, connection) {
    if (err !== null) {
        console.log("MySQL DB: ", err.message);
    } else {
        console.log("MySQL DB connected!", connection.config.host, connection.config.port);
    }
})

module.exports = connection