'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function groupByReceipt(rows: any[]) {
  const map = new Map();

  for (const row of rows) {
    if (!map.has(row.r_id)) {
      map.set(row.r_id, {
        r_id: row.r_id,
        r_date: row.r_date,
        s_name: row.s_name,
        items: []
      });
    }

    // Push item into that receipt's item list
    map.get(row.r_id).items.push({
      i_name: row.i_name,
      i_category: row.i_category,
      i_price: row.i_price
    });
  }

  // Return as an array
  return Array.from(map.values());
}

export default function Receipts() {
    type receiptItem = {
        i_name : string,
        i_category: string,
        i_price: number,
    }
    type receipt = {
        r_id: number,
        r_date: string,
        s_name: string,
        items: receiptItem[]
    }

    const [receipts, setReceipts] = useState<receipt[]>([])
    const [username, setUsername] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
    const u = localStorage.getItem("username")
    if (u) setUsername(u)
    }, [])

    useEffect(() => {
    if (username) {
        showReceipts()
    }
    }, [username])
    
    async function showReceipts() {  
      try {
          const res = await fetch(
              "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/getReceiptItems",
              {
                  method: "POST",
                  body: JSON.stringify({ username })
              }
          )
          
          const data = await res.json()
  
          let body
          let items
          try {
            body = JSON.parse(data.body);
            items = body.results
          } catch (err) {
            console.error("Failed to parse body", err);
          }
  
          if (data.statusCode != 200) {
              setError(data.error)
          } else {
              setMessage(body.message)
              setReceipts(groupByReceipt(body.items))
          }
      } catch (err) {
          console.error("something went wrong: ", err);
      }
    }
    return (
    <div>
        <button onClick={() => router.push("/shopperDashboard/createReceipt")}>Create Receipt</button>
        {receipts.length > 0? (
            receipts.map((r: any) => (
            <div key={r.r_id}>
                <h2>{r.c_name}</h2>
                <p>{r.s_address}</p>
                <p>{r.r_date}</p>
                <ul>
                {r.items.map((item: any) => (
                    <li key={item.i_id}>
                    {item.i_name} — {item.i_category} — ${item.i_price.toFixed(2)}
                    </li>
                ))}
                </ul>
            </div>
            ))
        ) : (
            <p>No Receipts Yet!</p>
        )}
    </div>
    )
}

