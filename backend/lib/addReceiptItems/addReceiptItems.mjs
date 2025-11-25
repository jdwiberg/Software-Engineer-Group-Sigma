import * as mysql2 from 'mysql2'

var pool

async function addReceiptItems (sql, params) {
  return new Promise((resolve, reject) => {
    pool.query(
        sql, params, (error) => {
            if (error) return reject(error)
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
        if ( !event.r_id) {
            throw new Error("Receipt ID is required")
        }
        if ( !event.receiptItems ) {
            throw new Error("Receipt Items required")
        }
        // Parse Receipt Items and Add to DB one by one
        const placeholder = event.receiptItems.map(() => '(?, ?, ?, ?)').join(', ')
        const params = event.receiptItems.flatMap(item => [item.i_name, item.i_category, item.i_price, event.r_id])
        const sql = `INSERT INTO item (i_name, i_category, i_price, r_id) VALUES ${placeholder}`

        await addReceiptItems(sql, params)
        result = { message: "Receipt Items added" }
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