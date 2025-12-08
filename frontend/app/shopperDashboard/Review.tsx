'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { get } from 'http'
import formatDate from '../aa-utils/formatDate'

export default function Review() {
    type purchasedItem = {
        i_id : number,
        i_name: string,
        i_category : string,
        r_date : string,
        c_name : string,
        s_address : string
    }
    
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [searched, setSearched] = useState(false)
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false)
    const [searchCat, setSearchCat] = useState("")
    const [searchType, setSearchType] = useState("")
    const [searchDate, setSearchDate] = useState<Date | null>(null)
    const [recentPurchases, setRecentPurchases] = useState<purchasedItem[] | null>([])
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
    const dateTypes = [
        "Past Day",
        "Past Week",
        "Past Month",
        "All time"
    ];

    function findSearchDate(type : string) {
        let dateFactor = 0
        if (type === "Past Day"){
            dateFactor = 1
        }
        else if (type === "Past Week"){
            dateFactor = 7
        }
        else if (type === "Past Month"){
            dateFactor = 30
        }
        let todaysDate = new Date()
        let prevDate = new Date()
        prevDate.setDate(todaysDate.getDate() - dateFactor)
        setSearchDate(prevDate)
        if (type === "All time"){
            setSearchDate(new Date(0))
        }
    }

    const router = useRouter()

    useEffect(() => {
    const u = localStorage.getItem("username")
    if (u) setUsername(u)
    }, [])

    useEffect(() => {
    if (username) {
    }
    }, [username])
    
    async function getRecents(date : Date, category : string) {  
    setLoading(true)
    setSearched(true)
      try {
          const res = await fetch(
              "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/searchRecentPurchases",
              {
                  method: "POST",
                  body: JSON.stringify({ username, i_category : category, r_date : date })
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
              setRecentPurchases(body.recentPurchases)
              setLoading(false)
              setSearchCat("")
              setSearchType("")
          }
      } catch (err) {
          console.error("something went wrong: ", err);
      }
    }

    return (
    <div>
        <select
            name='item category'
            value={searchCat}
            onChange={(e) => setSearchCat(e.target.value)}
            required
        >
            <option value="">Select a category</option>
            {categories.map((cat) => (
                <option key={cat} value={cat}>
                    {cat}
                </option>
            ))}
        </select>
        <select
            name='search by'
            value={searchType}
            onChange={(e) => {setSearchType(e.target.value), findSearchDate(e.target.value), console.log(searchDate)}}
            required
        >
            <option value="">Search by </option>
            {dateTypes.map((type) => (
                <option key={type} value={type}>
                    {type}
                </option>
            ))}
        </select>
        <button onClick={() => getRecents(searchDate!, searchCat!)}>Search Recent Purchases</button>
        {recentPurchases && recentPurchases.length > 0? (
            recentPurchases.map((item: purchasedItem) => (
            <div key={item.i_id}>
                <h2>{item.i_name}</h2>
                <p>{item.i_category}</p>
                <p>{item.c_name}</p>
                <p>{item.s_address}</p>
                <p>{formatDate(item.r_date)}</p>
            </div>
            ))
        ) : (
            <p>{(loading)? "Loading..." : (searched) ? "No Recent Purchases!" : "" }</p>
        )}
    </div>
    )
}
