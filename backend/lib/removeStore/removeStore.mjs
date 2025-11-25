import * as mysql2 from 'mysql2'

var pool

let RemoveStore = (s_id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM store WHERE s_id = ?;", [s_id], (error) => {
            if (error) {
                return reject(error)
            }
            if (results.affectedRows === 0) {
                return reject(new Error(`Store with s_id=${s_id} not found`));
            }
            resolve()
        })
    })
}            

export const handler = async (event) => {
    let result
    let code

    pool = mysql2.createPool({
        host: process.env.rdsHost,
        user: process.env.rdsUser,
        password: process.env.rdsPassword,
        database: process.env.rdsDatabase,

    });

    try {
        if ( !event.s_id ) {
            throw new Error("Missing s_id")
        }
        const s_id = event.s_id
        await RemoveStore(s_id)
        result = { message: "Store " + s_id + " removed"}
        code = 200
    } catch (err) {
        result = { error: err.message }
        code = 400
    }
    const response = {
        statusCode: code,
        body: JSON.stringify(result)
    }

    pool.end()
    return response
}