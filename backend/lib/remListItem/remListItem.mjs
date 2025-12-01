import * as mysql2 from 'mysql2'

var pool

let remShoppingList = (sli_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM shoppingListItem WHERE sli_id = ?;`, [sli_id], (error, results) => {
            if (error){
                return reject(error)
            }
            resolve(results)
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
        await remShoppingList(event.sli_id)
        result = { message: "removed shopping list item"}
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