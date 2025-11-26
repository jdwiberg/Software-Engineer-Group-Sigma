import * as mysql2 from "mysql2"

// Helper functions:
var pool

let getTotalShoppers = () => {
    return new Promise((resolve, reject) => {
        pool.query(
        "SELECT COUNT(*) AS shoppers FROM shopper;",
        (error, results) => {
            if (error) 
                return reject(error)
            resolve(results[0].shoppers)
        }
        )
    })
}

let getTotalRevenue = () => {
    return new Promise((resolve, reject) => {
        pool.query(
        "SELECT COALESCE(SUM(i.i_price), 0) AS revenue FROM item i;",
        (error, results) => {
            if (error)
                return reject(error)
            resolve(results[0].revenue || 0)
        }
        )
    })
}

let getTotalSales = () => {
    return new Promise((resolve, reject) => {
        pool.query(
        "SELECT COUNT(*) AS sales FROM receipt;",
        (error, results) => {
            if (error)
                return reject(error)
            resolve(results[0].sales)
        }
        )
    })
}




export const handler = async (event) => {
    let result
    let code

    pool = mysql2.createPool({
        host: process.env.rdsHost,
        user: process.env.rdsUser,
        password: process.env.rdsPassword,
        database: process.env.rdsDatabase,
    })

    try {
        const [shoppers, sales, revenue] = await Promise.all([
            getTotalShoppers(),
            getTotalSales(),
            getTotalRevenue(),
        ])

        result = {
            message: "retrieved admin stats",
                shoppers: shoppers,
                revenue: revenue,
                sales: sales,
        }
        code = 200
    } catch (err) {
        result = { error: err.message }
        code = 400
    }

    const response = {
        statusCode: code,
        body: JSON.stringify(result),
    }

    pool.end()
    return response
}