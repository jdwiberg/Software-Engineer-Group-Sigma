import * as mysql2 from 'mysql2'

var pool

let addShoppingList = (username, sl_name) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO 
                        shoppingList (sh_id, sl_name)
                    SELECT 
                        sh_id, ? FROM shopper
                    WHERE 
                        username = ?;`, [username, sl_name], (error, results) => {
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
        if ( !event.username || !event.sl_name ) {
            throw new Error("Shopping list invalid")
        }

        const listItems = await addShoppingList(event.username, event.sl_name)
        result = { message: "added shopping list", listItems}
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