// JUST OVERRIDE with My Config

// override db - mysql
if (process.env.MY_DB_HOST != null) {
    global.myConfig.mysql.host = process.env.MY_DB_HOST
}

// override API server 
if (process.env.MY_APP_HOST_PORT != null) {
    global.myConfig.server_port = process.env.MY_APP_HOST_PORT
}

// override FTP
if (process.env.MY_FTP_HOST != null) {
    global.myConfig.ftp.host = process.env.MY_FTP_HOST
    global.myConfig.ftp.user = process.env.MY_FTP_USER
    global.myConfig.ftp.password = process.env.MY_FTP_PASS
}