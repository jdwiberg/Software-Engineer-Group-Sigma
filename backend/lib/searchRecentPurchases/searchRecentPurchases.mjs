import * as mysql2 from 'mysql2'

var pool

let getShopperLists = (username, i_category, r_date) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT 
                        i.i_id,
                        i.i_name,
                        i.i_category,
                        r.r_date,
                        sc.c_name,
                        st.s_address
                    FROM 
                        shopper s
                    JOIN 
                        receipt r ON s.sh_id = r.sh_id
                    JOIN 
                        item i ON r.r_id = i.r_id
                    JOIN 
                        store st ON r.s_id = st.s_id
                    JOIN 
                        storeChain sc ON st.c_id = sc.c_id
                    WHERE 
                        s.username = ?
                    AND 
                        i.i_category = ?
                    AND 
                        r.r_date >= ?
                    ORDER BY r.r_date ASC;`, [username, i_category, r_date], (error, results) => {
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

        const recentPurchases = await getShopperLists(event.username, event.i_category, event.r_date)
        result = { message: "recent purchases: ", recentPurchases}
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