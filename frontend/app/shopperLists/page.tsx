'use client'
import { useEffect, useState } from 'react'

export default function ShopperDashboard() {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [items, setItems] = useState([]);

  useEffect(() => {
    const u = localStorage.getItem("username")
    if (u) setUsername(u)
  }, [])

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
  
      try {
          const res = await fetch(
              "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/getShopperLists",
              {
                  method: "POST",
                  body: JSON.stringify({ username })
              }
          )
          
          const data = await res.json()
  
          let body
          try {
            body = JSON.parse(data.body);
          } catch (err) {
            console.error("Failed to parse body", err);
          }
  
          if (data.statusCode != 200) {
              setError(data.error)
          } else {
              setMessage(body.message)
              setItems(body.items || [])
          }
      } catch (err) {
          console.error("something went wrong: ", err);
      }
    }

  return (
    <div>
      <h1>Welcome, {username}!</h1>
  <p>{message}</p>

  {items.length > 0 ? (
    <ul>
      {items.map((item, idx) => (
        <li key={idx}>
          <strong>List:</strong> {item.sl_name} <br />
          <strong>Item:</strong> {item.sli_name} <br />
          <strong>Category:</strong> {item.sli_category}
        </li>
      ))}
    </ul>
  ) : (
    <p>No items found</p>
  )}
    </div>
  )
}