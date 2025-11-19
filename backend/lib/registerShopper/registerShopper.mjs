import * as mysql2 from 'mysql2'

var pool

let CreateShopper = (username, password) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO shopper (username, password) VALUES (?, ?);", [username, password], (error) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return reject(new Error("Username is taken"))
                }
                return reject(error)
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
        database: process.env.rdsDatabase
    });

    try {
        if ( !event.username || !event.password ) {
            throw new Error("Both 'username' and 'password' required")
        }
        const uname = event.username
        const pword = event.password

        await CreateShopper(uname, pword)
        result = { message: uname + " registered as new shopper"}
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