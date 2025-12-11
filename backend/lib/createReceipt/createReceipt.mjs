import * as mysql2 from 'mysql2'

var pool

let createReceipt = (s_id, username, r_date) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO receipt (r_date, s_id, sh_id)
       SELECT ?, s.s_id, sh.sh_id
       FROM store AS s
       JOIN shopper AS sh ON sh.username = ?
       WHERE s.s_id = ?`,
      [r_date, username, s_id],
      (error) => {
        if (error) return reject(error);

        pool.query(
          `SELECT r_id, r_date, s_id FROM receipt WHERE r_id = LAST_INSERT_ID()`,
          (error, rows) => {
            if (error) return reject(error);
            resolve(rows[0].r_id);
          }
        )
      }
    )
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
        if ( !event.s_id) {
            throw new Error("Store is required")
        }
        if ( !event.username ) {
            throw new Error("Username is required")
        }
        if ( !event.r_date ) {
            throw new Error("Date is required")
        }

        const r_id = await createReceipt(event.s_id, event.username, event.r_date)
        result = { r_id: r_id }
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
