import * as mysql2 from 'mysql2'

var pool

let showShopperDash = (shopperID) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT 
                        sl.sl_name, sli.sli_name, sli.sli_category 
                    FROM 
                        shoppingList sl
                    LEFT JOIN 
                        shoppingListItem sli ON sl.sl_id = sli.sl_id 
                    WHERE 
                        sh_id = ?`, [shopperID], (error, results) => {
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
        if ( !event.shopperID ) {
            throw new Error("User is not logged in")
        }

        const shoppingLists = await showShopperDash(event.shopperID)
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