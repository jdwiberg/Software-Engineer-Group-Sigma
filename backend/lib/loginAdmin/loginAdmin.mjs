import * as mysql2 from 'mysql2'

export const handler = async (event) =>{
    let result
    let code

    try {

        const password = event.password // user input
        const corrPass = process.env.adminPass // correct password from .env

        if (!corrPass) throw new Error("Server misconfigured: adminPass not set")
        if (!password) throw new Error("A 'password' required")

        
        if ( password != corrPass ) {
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

  return response
};