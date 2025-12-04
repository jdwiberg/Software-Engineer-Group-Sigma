import * as mysql2 from 'mysql2'

var pool

let getItems = (imageData) => {
    const data = {
        s_name: "Demo Store",
        items: []
    }
    return data
}

let createReceipt = (s_id, username, items) => {
  return new Promise((resolve, reject) => {
    // pool.query()
    resolve(1)
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
        if ( !event.username ) {
            throw new Error("Username is required")
        }
        if ( !event.imageData ) {
            throw new Error("Image is required")
        }

        const data = await getItems(event.imageData)
        const store = data.s_name
        const items = data.items

        const r_id = await createReceipt(event.username, store, items)
        result = { r_id: r_id }
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