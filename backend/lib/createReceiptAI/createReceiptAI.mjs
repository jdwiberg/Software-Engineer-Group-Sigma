import * as mysql2 from 'mysql2'
import fs from 'fs/promises'
import path from "path"
import OpenAI from 'openai'


var pool
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export const getItems = async (file_string) => {
    try {
        const __dirname = path.dirname(fileURLToPath(import.meta.url)) // issue here
        const sys_prompt = await fs.readFile(path.join(__dirname, "sys_prompt.txt"), "utf8");
        const task_prompt = file_string

        const completion = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                { role: "system", content: sys_prompt },
                { role: "user", content: task_prompt }
            ],
            response_format: { type: "json_object" }
        })

        const json = completion.choices[0].message.parsed
        if (!json || Object.keys(json).length === 0) {
            throw new Error("Image is not of a receipt")
        }
        return {
            success: true,
            data: {
                c_name: json.s_name,
                s_address: json.s_address,
                items: json.items
            },
            error: null
        }

    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.message || "Unknown error occured while contacting AI"
        }
    }

}


export const handler = async (event) => {
    let result
    let code

    pool = mysql2.createPool({
        host: process.env.rdsHost,
        user: process.env.rdsUser,
        password: process.env.rdsPassword,
        database: process.env.rdsDatabase
    });

    try {
        if ( !event.imageData ) {
            throw new Error("Image is required")
        }

        const res = await getItems(event.imageData)

        if ( !res.success ) {
            result = { error: res.error }
            code = 400
        } else {
            result = { response: res.data }
            code = 200
        }

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