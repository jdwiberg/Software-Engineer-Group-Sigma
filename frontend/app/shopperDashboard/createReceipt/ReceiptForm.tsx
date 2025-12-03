'use client'
import { useEffect, FormEvent, useState } from 'react'
import StoreDropdown from './StoreDropdown'
import { useRouter } from 'next/navigation'

type ReceiptFormProps = {
    onSubmit?: () => void
}

export default function ReceiptForm({ onSubmit }: ReceiptFormProps) {
    type receiptItem = {
        i_name : string,
        i_category: string,
        i_price: number,
        quantity: number,
    }

    const [s_id, setSId] = useState<number | null>(null)
    const [username, setUsername] = useState("")
    const [r_id, setRId] = useState<number | null>(null)

    const [i_name, setIName] = useState("")
    const [category, setCategory] = useState("")
    const [price, setPrice] = useState("")
    const [quantity, setQuantity] = useState("")
    const [items, setItems] = useState<receiptItem[]>([])

    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
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

    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUsername(localStorage.getItem("username") || "")
        }
    }, [])

    async function createReceipt(s_id: number, username: string) {
        try {
            const res = await fetch(
                "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/createReceipt",
                {
                    method: "POST",
                    body: JSON.stringify({ s_id, username })
                }
            )

            const resp = await res.json()

            let body
            try {
                body = JSON.parse(resp.body);
            } catch (err) {
                console.error("Failed to parse body", err);
            }

            if (resp.statusCode != 200) {
                setError(resp.error)
            } else {
                setRId(body.r_id)
                return body.r_id
            }
        } catch (err) {
            console.error("something went wrong: ", err);
        }
    }

    async function addItems(r_id: number, receiptItems: receiptItem[]) {
        const itemsWithUnitPrice = receiptItems.map(item => ({
            ...item,
            unitPrice: item.i_price / item.quantity
        }))
        const payload =  { r_id: r_id, items: itemsWithUnitPrice }
        try {
            const res = await fetch(
                "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/addReceiptItems",
                {
                    method: "POST",
                    body: JSON.stringify({ r_id, receiptItems: itemsWithUnitPrice })
                }
            )

            const resp = await res.json()

            let body
            try {
                body = JSON.parse(resp.body);
            } catch (err) {
                console.error("Failed to parse body", err);
            }

            if (resp.statusCode != 200) {
                setError(resp.error)
            } else {
                setMessage(body.message)
            }
        } catch (err) {
            console.error("something went wrong: ", err);
        }
    }

    function handleAddItem() {
        if (!isAdding) {
            setIsAdding(true)
            return
        }
        setError("")
        setMessage("")

        const parsedPrice = parseFloat(price)
        const parsedQuantity = parseFloat(quantity)
        if (Number.isNaN(parsedPrice)) {
            setError("Price must be a number")
            return
        }
        if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
            setError("Quantity must be greater than zero")
            return
        }

        if (!i_name.trim() || !category.trim()) {
            setError("Name and category are required")
            return
        }

        setItems([...items, { i_name, i_category: category, i_price: parsedPrice, quantity: parsedQuantity }])
        setIName("")
        setCategory("")
        setPrice("")
        setQuantity("")
        setIsAdding(false)
    }

    async function removeItem(i_id: number) {
        const updatedItems = items.filter((_, index) => index !== i_id)
        setItems(updatedItems)
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")
        setMessage("")

        if (items.length === 0) {
            setError("Add at least one item before submitting")
            return
        }

        try {
            setIsSubmitting(true)
            const receiptId = await createReceipt(s_id as number, username)
            await addItems(receiptId as number, items)
            setMessage("Receipt submitted")
            setItems([])
            onSubmit?.()
            router.push('/shopperDashboard?tab=receipts')
        } catch (err) {
            console.error(err)
            setError("Failed to submit receipt")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (

        <form onSubmit={handleSubmit}>
            <StoreDropdown
                onSelectStore={(id) => {
                    if (id === null) {
                        setSId(null)
                        return
                    }
                    const parsed = typeof id === "number" ? id : Number(id)
                    setSId(Number.isNaN(parsed) ? null : parsed)
                }}
            />
            
            {isAdding && (
            <>
                <div>
                    <label htmlFor="itemName">Item Name</label>
                    <input
                        id="itemName"
                        type="text"
                        value={i_name}
                        onChange={(e) => setIName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="itemCategory">Category</label>
                    <select
                        id="itemCategory"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="itemPrice">Total Price</label>
                    <input
                        id="itemPrice"
                        type="number"
                        step="0.5"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="itemQuantity">Quantity</label>
                    <input
                        id="itemQuantity"
                        type="number"
                        min={(category == "Deli") ? "0.01" : "1"}
                        step={(category == "Deli") ? "0.01" : "1"}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                </>
            )}
            <button type="button" onClick={handleAddItem}>Add Item</button>

            {items.length > 0 && (
                <ul>
                    {items.map((item, i_id) => (
                        <li key={`${item.i_name}-${i_id}`}>
                            {item.i_name} | {item.i_category} | Qty: {item.quantity} | Total: ${item.i_price.toFixed(2)} | Unit: ${(item.i_price / item.quantity).toFixed(2)}
                            <button>Edit</button>
                            <button type="button" onClick={() => removeItem(i_id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}

            <button type="submit" disabled={isSubmitting}>Submit Receipt</button>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </form>
    )
}
