export const handler = async (event) => {
    let result
    let code

    try {
        if ( !event.username || !event.password ) {
            throw new Error("Both 'username' and 'password' required")
        }

        const username = event.username
        const password = event.password

        // check if password exists in DB
        
        // send back to client
        result = { message: username + " registered as new shopper"}
        code = 200

    } catch (error) {
        result = { error: error.message}
        code = 400
    }

    const response = {
        statusCode: code,
        body: JSON.stringify(result)
    }

    // pool.end()
    return response
};