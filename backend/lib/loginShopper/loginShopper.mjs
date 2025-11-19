import * as mysql2 from 'mysql2'

var pool

let loginShopper = (username, password) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM shopper WHERE username = ? AND password = ?", [username, password], (error, rows) => {
            if (error){
                return reject(error)
            }
            if(rows.length === 0){
                return {statusCode : 400, body : "invalid username or password" }
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
        if ( !event.username || !event.password ) {
            throw new Error("Both 'username' and 'password' required")
        }
        const uname = event.username
        const pword = event.password

        await loginShopper (uname, pword)
        result = { message: uname + " logged in successfully"}
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