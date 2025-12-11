import * as mysql2 from 'mysql2'

var pool

let getStoreChains = () => {
    return new Promise((resolve, reject) => {
        pool.query(`
            SELECT
                sc.c_id,
                sc.c_name,
                sc.c_url,
                s.s_id,
                s.s_address,
                COALESCE(SUM(i.i_price), 0) AS revenue
            FROM storeChain sc
            LEFT JOIN store s ON s.c_id = sc.c_id
            LEFT JOIN receipt r ON r.s_id = s.s_id
            LEFT JOIN item i ON i.r_id = r.r_id
            GROUP BY sc.c_id, sc.c_name, sc.c_url, s.s_id, s.s_address
            ORDER BY sc.c_name, s.s_id;
        `, [], (error, rows) => {
            if (error){
                return reject(error)
            }
            
            // Transform flat rows into nested structure
            const chainMap = {};
            rows.forEach(row => {
                if (!chainMap[row.c_id]) {
                    chainMap[row.c_id] = {
                        c_id: row.c_id,
                        c_name: row.c_name,
                        c_url: row.c_url,
                        store: []
                    };
                }
                if (row.s_id) {
                    chainMap[row.c_id].store.push({
                        s_id: row.s_id,
                        s_address: row.s_address,
                        revenue: row.revenue
                    });
                }
            });
            
            resolve(Object.values(chainMap))
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

        const resp = await getStoreChains()

        result = { storeChains: resp }
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