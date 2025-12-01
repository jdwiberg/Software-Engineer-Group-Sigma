'use client'
import { useEffect, useState } from 'react'

export default function Lists() {

    type shoppingList = {
        sl_id: number,
        sl_name: string,
        sl_date: string
    }
    type listItem = {
        sli_name : string,
        sli_category : string
    }
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [username, setUsername] = useState("")
    const [listName, setListName] = useState("") //for adding a new list
    const [isDeleting, setIsDeleting] = useState(false)
    const [shoppingLists, setShoppingLists] = useState<shoppingList[]>([])
    const [shoppingListItems, setShoppingListItems] = useState<listItem[]>([])
    const [open, setOpen] = useState(false)
    const [selectedList, setSelectedList] = useState<shoppingList | null>(null) // for selecting a list to display items
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isAdding, setIsAdding] = useState(false)// for adding a new item to a list
    const [itemName, setItemName] = useState("")
    const [itemCat, setItemCat] = useState("")
    
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

    async function showItems(sl_name : string) {  
      try {
          const res = await fetch(
              "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/getList", 
                {
                    method: "POST",
                    body: JSON.stringify({ username, sl_name })
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
              setShoppingListItems(body.listItems || [])
          }
      } catch (err) {
          console.error("something went wrong: ", err);
      }
    }


    async function submitList(e: React.FormEvent) {
        e.preventDefault();
        setMessage("")
        setError("")
        setIsSubmitting(true)
    
        try {
            const res = await fetch(
                "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/addShoppingList",
                {
                    method: "POST",
                    body: JSON.stringify({ username, sl_name : listName })
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
                setMessage("Invalid list name, please try again.")
            } else {
                setMessage(body.message)
                setListName("")
                await showLists()
            }
        } catch (err) {
            console.error("something went wrong: ", err);
        } finally {
            setIsSubmitting(false)
        }
      }

    async function removeList(sl_id : number) {
        setMessage("")
        setError("")
        setIsDeleting(true)
    
        try {
            const res = await fetch(
                "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/remShoppingList",
                {
                    method: "POST",
                    body: JSON.stringify({ sl_id })
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
                setMessage("Some error")
            } else {
                setMessage(body.message)
                setIsDeleting(false)
                await showLists()
            }
        } catch (err) {
            console.error("something went wrong: ", err);
        }
      }

    async function addListItem(e: React.FormEvent) {
        e.preventDefault();
        setMessage("")
        setError("")
        setIsAdding(true)
        try {
            const res = await fetch(
                "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/addListItem",
                {
                    method: "POST",
                    body: JSON.stringify({ 
                        sl_id : selectedList?.sl_id, 
                        sli_name : itemName, 
                        sli_category : itemCat 
                    })
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
                setMessage("Some error")
            } else {
                if (selectedList) {
                    await showItems(selectedList.sl_name)
                }
                setMessage(body.message)
            }
        } catch (err) {
            console.error("something went wrong: ", err);
        } finally {
            setItemName("")
            setItemCat("")
            setIsAdding(false)
        }
      }



    return (
    <div>
        <h1>Create List</h1>
        <form onSubmit={submitList}>

          <input 
            name='listName'
            type="text"
            placeholder='List Name'
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            required
          />

          <button 
          type='submit'
          disabled={isSubmitting}
          >
          {isSubmitting ? "Making list... " : "Create List" }
          </button>
        </form>
        {shoppingLists.length > 0 ? (
        <>
            <ul>
            {shoppingLists.map((shoppingList, idx) => (
                <li key={idx}>
                <strong>List:</strong> {shoppingList.sl_name} <br />
                <strong>Date Created:</strong> {shoppingList.sl_date} <br />
                <button
                    onClick={() => {
                        setSelectedList(shoppingList);
                        showItems(shoppingList.sl_name);
                        setOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    View {shoppingList.sl_name}
                </button>
                <button
                    type='button'
                    disabled={isDeleting && selectedList?.sl_id === shoppingList.sl_id}
                    onClick={() => {
                        // ensure the UI knows which list is being deleted
                        setSelectedList(shoppingList);
                        removeList(shoppingList.sl_id);
                    }}
                >
                    {isDeleting && selectedList?.sl_id === shoppingList.sl_id ? "Deleting... " : "Delete list"}
                </button>
                </li>
            ))}
            </ul>
            {open && selectedList && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-xl shadow-xl">
                
                <h2 className="text-xl font-bold">{selectedList.sl_name}</h2>

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

                <h3>Add Item</h3>
                <form onSubmit={addListItem}>
                <input 
                    name='itemName'
                    type="text"
                    placeholder='Item Name'
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                />
                <input 
                    name='itemCat'
                    type="text"
                    placeholder='Item Category'
                    value={itemCat}
                    onChange={(e) => setItemCat(e.target.value)}
                    required
                />
                <button 
                type='submit'
                disabled={isAdding}
                >
                {isAdding ? "Adding... " : "Add Item" }
                </button>
                </form>
                </div>
            </div>
            )}

        </>
        ) : (
        <p>No items found</p>
        )}
    </div>
    );

}
