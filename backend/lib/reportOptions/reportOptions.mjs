import * as mysql2 from 'mysql2'

var pool

let reportOptions = (categories) => {
    return new Promise((resolve, reject) => {
        if (!categories) {
            return reject(new Error("Please select a shopping list"));
        }
        if (categories.length === 0) {
            return reject(new Error("Please add items to shopping list"));
        }
        for (let i = 0; i < categories.length; i++)
            pool.query(`SELECT 
                            item.i_name,
                            item.i_category,
                            item.i_price,
                            store.s_address,
                            storeChain.c_name AS chain_name
                        FROM 
                            item
                        JOIN 
                            receipt ON item.r_id = receipt.r_id
                        JOIN 
                            store ON receipt.s_id = store.s_id
                        JOIN 
                            storeChain ON store.c_ID = storeChain.c_id
                        WHERE 
                            item.i_category = ?;`, [categories[i]], (error, results) => {
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

        const options = await reportOptions(event.categories)
        result = { message: "Options: ", options}
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