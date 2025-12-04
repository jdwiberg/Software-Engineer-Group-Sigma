import * as mysql2 from 'mysql2'

var pool

let removeReceipt = (i_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM item WHERE i_id = ?;`, [i_id], (error) => {
            if (error){
                return reject(error)
            }
            resolve()
        })
    })
}

export const handler = async (event) =>{
    let result
    let code

    pool = mysql2.createPool({
        host: process.env.rdsHost,
        user: process.env.rdsUser,
        password: process.env.rdsPassword,
        database: process.env.rdsDatabase
    });

    try {
        await removeReceipt(event.i_id)
        result = { message: "removed receipt item" }
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
};