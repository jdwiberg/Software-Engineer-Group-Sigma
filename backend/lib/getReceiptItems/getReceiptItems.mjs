import * as mysql2 from 'mysql2'

var pool

let getReceiptItems = (username) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT 
                    r.r_id,
                    r.r_date,
                    s.s_id,
                    s.s_address,
                    sc.c_id,
                    sc.c_name,
                    sc.c_url,
                    i.i_id,
                    i.i_name,
                    i.i_category,
                    i.i_price
                FROM 
                    receipt r
                JOIN 
                    shopper sh ON r.sh_id = sh.sh_id
                JOIN 
                    store s ON r.s_id = s.s_id
                JOIN 
                    storeChain sc ON s.c_id = sc.c_id
                JOIN 
                    item i ON r.r_id = i.r_id
                WHERE 
                    sh.username = ?;`, [username], (error, results) => {
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

        const items = await getReceiptItems(event.username)
        result = { message: "retrieved receipt items", shoppingLists}
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