'use client'
import { useEffect, useState } from 'react'

export default function ShopperDashboard() {
  type shoppingList = {
    sl_name: string,
    sl_date: string
  }

  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [shoppingLists, setShoppingLists] = useState<shoppingList[]>([]);

  useEffect(() => {
    const u = localStorage.getItem("username")
    if (u) setUsername(u)
  }, [])

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
  
      try {
          const res = await fetch(
              "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/showShopperDash",
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
              setShoppingLists(body.shoppingLists || [])
          }
      } catch (err) {
          console.error("something went wrong: ", err);
      }
    }

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>{message}</p>

      {shoppingLists.length > 0 ? (
        <ul>
          {shoppingLists.map((shoppingList, idx) => (
            <li key={idx}>
              <strong>List:</strong> {shoppingList.sl_name} <br />
              <strong>Date Created:</strong> {shoppingList.sl_date} <br />
            </li>
          ))}
        </ul>
      ) : (
        <p>No items found</p>
      )}
    </div>
  )
}