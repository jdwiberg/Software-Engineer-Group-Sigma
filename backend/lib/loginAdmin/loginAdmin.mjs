import * as mysql2 from 'mysql2'

var pool

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
        if ( !event.password ) {
            throw new Error("A 'password' required")
        }

        const password =  event.password
        const corrPass = process.env.adminPass
        if ( password !== corrPass ) {
            throw new Error("Incorrect password")
        }
        result = { message: "logged in successfully!"}
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