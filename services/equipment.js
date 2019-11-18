const db = require('../databases/mysql.js')

const tbName = 'tb_equipments'

function onDelete(column) {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM ?? WHERE ?', [tbName, column], (error, result) => {
            if (error) return reject(error)
            resolve(result)
        })
    });
}

function findOne(column) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM ?? WHERE ? LIMIT 1', [tbName, column], (error, result) => {
            if (error) return reject(error)
            resolve(result[0])
        })
    })
}

function onCreate(value) {
    return new Promise((resolve, reject) => {
        // eq_name, eq_detail, eq_image
        db.query('INSERT INTO ?? SET ?', [tbName, value], (error, result) => {
            if (error) return reject(error)
            resolve(result)
        })
    })
}

function onUpdate(id, value) {
    return new Promise((resolve, reject) => {
        // eq_name, eq_detail, eq_image
        // console.log('Update value:', value);
        db.query(`UPDATE ?? 
                SET eq_name = ?,
                eq_detail = ?,
                eq_image = ?
                WHERE eq_id = ?`,
            [tbName,
                value.eq_name,
                value.eq_detail,
                value.eq_image,
                id
            ], (error, result) => {
                if (error) return reject(error)
                resolve(result)
            })
    })
}

module.exports = {
    findOne,
    onCreate,
    onUpdate,
    onDelete
}