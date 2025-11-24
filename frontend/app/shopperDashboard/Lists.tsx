'use client'
import { useEffect, useState } from 'react'

export default function Lists() {

    type shoppingList = {
        sl_name: string,
        sl_date: string
    }
    type listItems = {
        sli_name : string,
        sli_category : string
    }

    const [username, setUsername] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [shoppingLists, setShoppingLists] = useState<shoppingList[]>([])
    const [shoppingListItems, setShoppingListItems] = useState<listItems[]>([])
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const u = localStorage.getItem("username")
        if (u) setUsername(u)
    }, [])
    
    useEffect(() => {
        if (username) {
        showLists()
        }
    }, [username])

   async function showLists() {  
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

    async function showItems(listName : string) {  
      try {
          const res = await fetch(
              "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/getList", //need to change this link
                {
                    method: "POST",
                    body: JSON.stringify({ username, listName })
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
              setShoppingListItems(body.shoppingListItems || [])
          }
      } catch (err) {
          console.error("something went wrong: ", err);
      }
    }



    return (
    <div>
    {shoppingLists.length > 0 ? (
      <ul>
        {shoppingLists.map((shoppingList, idx) => (
          <li key={idx}>
            <strong>List:</strong> {shoppingList.sl_name} <br />
            <strong>Date Created:</strong> {shoppingList.sl_date} <br />

            <button
              onClick={() => {
                setOpen(true);
                showItems(shoppingList.sl_name);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              View List
            </button>

            {open && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-xl shadow-xl">
                  <h2 className="text-xl font-bold">{shoppingList.sl_name}</h2>

                  <ul className="mt-4">
                    {shoppingListItems.map((item, i) => (
                      <li key={i} className="border-b py-2">
                        <strong>Item:</strong> {item.sli_name} <br />
                        <strong>Category:</strong> {item.sli_category}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setOpen(false)}
                    className="mt-4 px-3 py-2 bg-red-500 text-white rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p>No items found</p>
    )}
    </div>
    );

}