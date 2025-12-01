import * as mysql2 from 'mysql2'

var pool

let addListItem = (sl_id, sli_name, sli_category) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO 
                        shoppingListItem (sli_name, sli_category, sl_id)
                    VALUES 
                        (?, ?, ?);`, [sli_name, sli_category, sl_id], (error, results) => {
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
        if ( !event.sl_id || event.sli_category.replace(/\s+/g, "") === "" || event.sli_name.replace(/\s+/g, "") === "") {
            throw new Error("Invalid entry")
        }

        const listItems = await addListItem(event.sl_id, event.sli_name, event.sli_category)
        result = { message: "added item to list", listItems}
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