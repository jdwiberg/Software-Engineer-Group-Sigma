import * as mysql2 from 'mysql2'

var pool

let addStoreChain = (c_name, c_url) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO storeChain (c_name, c_url) VALUES (?, ?);`, [c_name, c_url], (error) => {
            if (error){
                if (error.code === 'ER_DUP_ENTRY') {
                    return reject(new Error("This chain already exists"))
                }
                return reject(error)
            }
            resolve()
        })
    })
}

//need to add a quantity column to shoppingListItem

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
        if ( !event.c_name) {
            throw new Error("Store Chain name is required")
        }
        if ( !event.c_url ) {
            throw new Error("Store Chain url is required")
        }

        await addStoreChain(event.c_name, event.c_url)
        result = { message: `${event.c_name} added` }
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