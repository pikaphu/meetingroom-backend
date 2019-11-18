const db = require('../databases/mysql.js')

const tbName = 'tb_equipments'

function onDelete(column) {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM tb_equipments WHERE ?', column, (error, result) => {
            if (error) return reject(error)
            resolve(result)
        })
    });
}

function findOne(column) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tb_equipments WHERE ? LIMIT 1', column, (error, result) => {
            if (error) return reject(error)
            resolve(result[0])
        })
    })
}

function onCreate(value) {
    return new Promise((resolve, reject) => {
        // eq_name, eq_detail, eq_image
        db.query('INSERT INTO tb_equipments set ?', value, (error, result) => {
            if (error) return reject(error)
            resolve(result)
        })
    })
}

module.exports = {
    findOne,
    onCreate,
    onDelete
}