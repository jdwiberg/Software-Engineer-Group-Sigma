import * as mysql2 from 'mysql2'

var pool

let getStoreChains = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT
                    sc.c_id   AS c_id,
                    sc.c_name AS c_name,
                    sc.c_url  AS c_url,
                    COALESCE(
                        NULLIF(
                            JSON_ARRAYAGG(
                                CASE
                                    WHEN s.s_id IS NOT NULL THEN JSON_OBJECT('s_id', s.s_id, 's_address', s.s_address)
                                END
                            ),
                            JSON_ARRAY(NULL)
                        ),
                        JSON_ARRAY()
                    ) AS store
                    FROM storeChain AS sc
                    LEFT JOIN store AS s
                    ON s.c_id = sc.c_id
                    GROUP BY sc.c_id, sc.c_name, sc.c_url
                    ORDER BY sc.c_name;`, [], (error, rows) => {
            if (error){
                return reject(error)
            }
            resolve(rows)
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