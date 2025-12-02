import * as mysql2 from 'mysql2'

var pool

let addStore = (s_address, c_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO store (s_address, c_id) VALUES (?, ?);`, [s_address, c_id], (error) => {
            if (error){
                if (error.code === 'ER_DUP_ENTRY') {
                    return reject(new Error("This store already exists"))
                }
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
        if ( !event.s_address ) {
            throw new Error("Store Chain address is required")
        }
        if ( !event.c_id ) {
            throw new Error("Store Chain id is required")
        }

        await addStore(event.s_address, event.c_id)
        result = { message: `${event.s_address} added` }
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
