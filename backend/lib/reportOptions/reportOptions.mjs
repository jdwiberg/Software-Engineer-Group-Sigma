import * as mysql2 from 'mysql2';

var pool;

let reportOptions = (sl_id) => {
    return new Promise((resolve, reject) => {
        // Get shopping list categories in order
        pool.query(
            `SELECT 
                sli_id,
                sli_category,
                sli_name
             FROM 
                shoppingListItem
             WHERE 
                sl_id = ?
             ORDER BY sli_id`,[sl_id], (error1, listRows) => {
                if (error1) {
                    return reject(error1)
                }
                // Get all receipt items and their stores for each shopping list item
                pool.query(
                    `SELECT 
                        item.i_category AS category,
                        item.i_name,
                        item.i_price,
                        store.s_address,
                        storeChain.c_name
                     FROM 
                        item
                     JOIN 
                        receipt ON item.r_id = receipt.r_id
                     JOIN 
                        store ON receipt.s_id = store.s_id
                     JOIN storeChain ON store.c_id = storeChain.c_id`, [], (error2, itemRows) => {
                        if (error2) {
                            return reject(error2)
                        }
                        // Format so that each shopping list item has a list of options from its category
                        const result = []

                        for (const sli of listRows) {
                            const options = itemRows
                                .filter(row => row.category === sli.sli_category)
                                .map(row => ({
                                    i_name: row.i_name,
                                    i_id: row.i_id,
                                    price: row.i_price,
                                    s_address: row.s_address,
                                    c_name: row.c_name
                                }))

                            result.push({
                                sli_name: sli.sli_name,
                                options
                            })
                        }
                        resolve({ result })
                    }
                )
            }
        )
    })
}

/*
{
    "items" : [
        {
            "sli_name" : "bagels",
            "options" : [
                {           
                    "name" : "bagels",
                    "price" : 3.99,
                    "address" : "address", 
                    "chain name" : "chain name"
                },
                {           
                    "name" : "english muffins",
                    "price" : 2.00,
                    "address" : "address", 
                    "chain name" : "chain name"
                }

            ]
        },
        {
            "sli_name" : "apples",
            "options" : [
                {           
                    "name" : "apples",
                    "price" : 3.99,
                    "address" : "address", 
                    "chain name" : "chain name"
                },
                {           
                    "name" : "bananas",
                    "price" : 2.00,
                    "address" : "address", 
                    "chain name" : "chain name"
                }

            ]
        }
    ]
}
*/

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

        const items = await reportOptions(event.sl_id)
        result = { items }
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