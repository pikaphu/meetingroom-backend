const db = require('../databases/mysql.js')

// table name of databases
const tbName = 'tb_equipments'

// get all rows
function list(value) {
    return new Promise((resolve, reject) => {
        // console.log(value);        
        // pagination var
        const limitPage = value.limit || 10 // default limit per page
        const startPage = ((value.page || 1) - 1) * limitPage // paging

        // sql statements
        const sqlCmds = {
            count: `SELECT COUNT(*) as 'rows' FROM ${tbName}`,
            select: `SELECT * FROM ${tbName}`
        }

        // Search condition
        if (value.search_key && value.search_text) {
            const key = value.search_key
            const txt = value.search_text
            const sqlSearch = ` WHERE ${db.escapeId(key)} LIKE ${db.escape(`%${txt}%`)}`

            // append condition to each statements
            for (var index in sqlCmds) {
                sqlCmds[index] += sqlSearch
            }
        }

        // get rows number
        db.query(sqlCmds.count, (error, result) => {
            if (error) return reject(error)

            // prepare data
            const items = {
                rows: result[0].rows,
                result: []
            }

            // pagination to query
            sqlCmds.select += ` LIMIT ${db.escape(startPage)}, ${limitPage}` // LIMIT value, offset

            // execute query to get result
            db.query(sqlCmds.select, (error, result) => {
                if (error) return reject(error)

                items.result = result
                resolve(items)
            })
        })

        // db.query('SELECT * FROM ??', tbName, (error, result) => {
        //     if (error) return reject(error)
        //     const items = {
        //         rows: result.length,
        //         result
        //     }
        //     resolve(items)      
        // })

    })
}

// get one rows
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

function onDelete(column) {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM ?? WHERE ?', [tbName, column], (error, result) => {
            if (error) return reject(error)
            resolve(result)
        })
    });
}

module.exports = {
    list,
    findOne,
    onCreate,
    onUpdate,
    onDelete
}