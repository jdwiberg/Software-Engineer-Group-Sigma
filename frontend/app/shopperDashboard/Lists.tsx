'use client'
import { useEffect, useState } from 'react'
import formatDate from '../aa-utils/formatDate'
import stringSimilarity from "string-similarity";
import { report } from 'process';

export default function Lists() {

    type ShoppingList = {
        sl_id: number,
        sl_name: string,
        sl_date: string
    }
    type ListItem = {
        sli_id : number,
        sli_name : string,
        sli_category : string
    }
    type ReceiptItem = {
        i_name: string,
        i_id: number,
        price: number,
        s_address: string,
        c_name: string
    }
    type ItemOptions = {
        sli_name: string,
        sli_id: number,
        options: ReceiptItem[]
    }
    
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [username, setUsername] = useState("")
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([])      // for veiwing shopping lists
    const [shoppingListItems, setShoppingListItems] = useState<ListItem[]>([])  // for veiwing an individual shopping list
    const [open, setOpen] = useState(false)
    const [listName, setListName] = useState("")                                //for adding a new list
    const [isDeleting, setIsDeleting] = useState(false)                         // for deleting a shopping list
    const [selectedList, setSelectedList] = useState<ShoppingList | null>(null) // for selecting a list to display items
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isAdding, setIsAdding] = useState(false)                             // for adding a new item to a list
    const [itemName, setItemName] = useState("")
    const [itemCat, setItemCat] = useState("")
    const [selectedItem, setSelectedItem] = useState<ListItem | null>(null)     // for removing a list item
    const [isRemoving, setIsRemoving] = useState(false)     
    const [options, setOptions] = useState<{ [key: string]: ReceiptItem[] }>({})    
    const [showOptions, setShowOptions] = useState(false)    
    const [listForOptions, setListForOptions] = useState("") // for showing the name of the list that is showing options   

    const categories = [
        "Alocohol & Spirits",
        "Baking Supplies",
        "Beverages",
        "Bread & Bakery",
        "Breakfast & Cereal",
        "Canned Goods & Soups",
        "Condiments & Sauces",
        "Dairy & Eggs",
        "Deli",
        "Frozen Foods",
        "Fruits & Vegetables",
        "Grains & Pasta",
        "Household Essentials",
        "International Foods",
        "Meat & Seafood",
        "Pantry Staples",
        "Pet Supplies",
        "Snacks & Candy",
        "Spices & Seasonings",
        "Toiletries & Personal Care",
        "Other"
    ];
    
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

    async function showItems(sl_id : number) {  
      try {
          const res = await fetch(
              "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/getList", 
                {
                    method: "POST",
                    body: JSON.stringify({ username, sl_id })
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
                await showLists()
                // clear any selection that might reference the deleted list
                setSelectedList(null)
                setShoppingListItems([])
                setOpen(false)
            }
        } catch (err) {
            console.error("something went wrong: ", err);
        } finally {
            setIsDeleting(false)
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
                    await showItems(selectedList.sl_id)
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

    async function removeListItem(sli_id : number) {
        setMessage("")
        setError("")
        setIsRemoving(true)
    
        try {
            const res = await fetch(
                "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/remListItem",
                {
                    method: "POST",
                    body: JSON.stringify({ sli_id })
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
                await showItems(selectedList!.sl_id)
            }
        } catch (err) {
            console.error("something went wrong: ", err);
        } finally {
            setIsRemoving(false)
            setSelectedItem(null)
        }
      }

    async function reportOptions(sl_id : number) {
        setMessage("")
        setError("")
    
        try {
            const res = await fetch(
                "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/reportOptions",
                {
                    method: "POST",
                    body: JSON.stringify({ sl_id })
                }
            )
            
            const data = await res.json()
    
            let body: any = {};
            try {
              body = JSON.parse(data.body);
            } catch (err) {
              console.error("Failed to parse body", err);
            }
    
            if (data.statusCode != 200) {
                setError(data.error)
                setMessage("Some error")
            } else {
                const options: { [key: string]: ReceiptItem[] } = {}
                for (const item of (body.items.result as ItemOptions[])) {
                    options[item.sli_name] = findSimilarItems(item.sli_name, item.options)
                }
                setOptions(options)
                setShowOptions(true)
            }
        } catch (err) {
            console.error("something went wrong: ", err);
        } finally {
            setIsRemoving(false)
            setSelectedItem(null)
        }
      }

    const findSimilarItems = ( target: string, comps: ReceiptItem[] ) => {
        let sims = []
        for (let i = 0; i < comps.length; i++) {
            const score = stringSimilarity.compareTwoStrings(target.toLowerCase(), comps[i].i_name)
            if (score > 0.69) {
                sims.push(comps[i])
            }
        }
        return sims
    }



    return (
    <div className="shopping-lists">
        <div className="shopping-panel">
            <h1>Create List</h1>
            <form onSubmit={submitList} className="form-stack">
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
                <ul className="list-grid">
                {shoppingLists.map((shoppingList) => (
                    <li key={shoppingList.sl_id} className="list-card">
                        <div><strong>List:</strong> {shoppingList.sl_name}</div>
                        <div><strong>Date Created:</strong> {formatDate(shoppingList.sl_date)}</div>
                        <div className="card-actions">
                            <button onClick={() => {reportOptions(shoppingList.sl_id), setListForOptions(shoppingList.sl_name)}}>Show Options</button>
                            <button
                                onClick={() => {
                                    setSelectedList(shoppingList);
                                    showItems(shoppingList.sl_id);
                                    setOpen(true);
                                }}
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
                        </div>
                    </li>
                ))}
                </ul>
                {open && selectedList && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl">
                    
                    <h2 className="text-xl font-bold">{selectedList.sl_name}</h2>

                    <ul className="mt-4">
                        {shoppingListItems.map((item) => (
                        <li key={item.sli_id} className="border-b py-2">
                            <strong>Item:</strong> {item.sli_name} <br />
                            <strong>Category:</strong> {item.sli_category}
                        <button
                            type='button'
                            disabled={isRemoving  && selectedItem?.sli_id === item.sli_id}
                            onClick={() => {
                                setSelectedItem(item)
                                removeListItem(item.sli_id)
                                showItems(selectedList.sl_id)
                            }}
                        >
                            {isRemoving  && selectedItem!.sli_id === item.sli_id ? "Removing... " : "Remove item"}
                        </button>
                        </li>

                        ))}
                    </ul>

                    <button
                        onClick={() => setOpen(false)}
                        className="mt-4 px-3 py-2 bg-red-500 text-white rounded"
                    >
                        Close
                    </button>

                    <h2>Add Item</h2>
                    <form onSubmit={addListItem} className="form-stack">
                    <input 
                        name='itemName'
                        type="text"
                        placeholder='Item Name'
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                    />
                    <select
                        name='itemCat'
                        value={itemCat}
                        onChange={(e) => setItemCat(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
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
        <div className="options-panel">
            {showOptions && <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h1>Purchasing Options for {listForOptions}</h1>
                    <button type="button" onClick={() => setShowOptions(false)}>Hide</button>
                </div>
                {Object.entries(options).map(([sli_name, items]) => (
                    <div key={sli_name} style={{ marginBottom: "1rem" }}>
                        <h3>{sli_name}</h3>
                        {items.length === 0 ? (
                            <p>No matching items found.</p>
                        ) : (
                            <ul>
                                {items.map((item, idx) => (
                                    <li key={`${sli_name}-${idx}`}>
                                        <div><strong>Item:</strong> {item.i_name}</div>
                                        <div><strong>Price:</strong> ${item.price.toFixed(2)}</div>
                                        <div><strong>Store:</strong> {item.c_name}</div>
                                        <div><strong>Address:</strong> {item.s_address}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
            }
        </div>
    </div>
    );
}
