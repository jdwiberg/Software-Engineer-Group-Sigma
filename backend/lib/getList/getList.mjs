import * as mysql2 from 'mysql2'

var pool

let getListItems = (sl_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT  
                        sli_id,
                        sli_name, 
                        sli_category
                    FROM 
                        shoppingListItem
                    WHERE 
                        sl_id = ?;`, [sl_id], (error, results) => {
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
        if ( !event.sl_id ) {
            throw new Error("Shopping list does not exist")
        }

        const listItems = await getListItems(event.sl_id)
        result = { message: "retrieved shopping list items", listItems}
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