import * as mysql2 from 'mysql2'

var pool

let getShopperLists = (username) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT 
                        sl.sl_name,
                        sli.sli_name,
                        sli.sli_category
                    FROM 
                        shoppingList sl
                    LEFT JOIN 
                        shoppingListItem sli ON sl.sl_id = sli.sl_id
                    JOIN
                        shopper sh ON sl.sh_id = sh.sh_id
                    WHERE 
                        sh.username = ?`, [username], (error, results) => {
            if (error){
                return reject(error)
            }
            resolve(results)
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
        if ( !event.username ) {
            throw new Error("User is not logged in")
        }

        const shoppingLists = await getShopperLists(event.username)
        result = { message: "retrieved shopping lists", shoppingLists: shoppingLists}
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