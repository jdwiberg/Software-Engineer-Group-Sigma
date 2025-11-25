import * as mysql2 from 'mysql2'

var pool

let getListItems = (username, sl_name) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT  
                        sli.sli_name, 
                        sli.sli_category
                    FROM 
                        shoppingListItem sli
                    JOIN 
                        shoppingList sl ON sli.sl_id = sl.sl_id
                    JOIN 
                        shopper s ON sl.sh_id = s.sh_id
                    WHERE 
                        s.username = ? AND sl.sl_name = ?;`, [username, sl_name], (error, results) => {
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

        const listItems = await getListItems(event.username, event.sl_name)
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