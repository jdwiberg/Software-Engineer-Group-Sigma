import * as mysql2 from 'mysql2'

var pool

let RemoveStoreChain = (c_id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM storeChain WHERE c_id = ?;", [c_id], (error) => {
            if (error) {
                return reject(error)
            }
            if (results.affectedRows === 0) {
                return reject(new Error(`Store Chain with c_id=${c_id} not found`));
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
        if ( !event.c_id ) {
            throw new Error("c_id required")
        }
        const c_id = event.c_id
        await RemoveStoreChain(c_id)
        result = { message: "Store chain " + c_id + " removed"}
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