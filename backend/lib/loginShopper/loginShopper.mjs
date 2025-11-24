import * as mysql2 from 'mysql2'
import bcrypt from 'bcryptjs'

var pool

let loginShopper = (username) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT password FROM shopper WHERE username = ?", [username], (error, rows) => {
            if (error){
                return reject(error)
            }
            if(rows.length === 0){
                return reject(new Error("invalid username or password"))
            }
            const hashed = rows[0].password
            resolve(hashed)
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
        if ( !event.username || !event.password ) {
            throw new Error("Both 'username' and 'password' required")
        }

        const hashed = await loginShopper(event.username)
        const ok = await bcrypt.compare(event.password, hashed)
        if (!ok){
            throw new Error("invalid username or password")
        }
        const username = event.username
        result = { message: "logged in successfully", username}
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