'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { get } from 'http'

/*
function searchRecent(rows: any[]) {
  const map = new Map();

  for (const row of rows) {
    if (!map.has(row.r_id)) {
      map.set(row.r_id, {
        r_id: row.r_id,
        r_date: row.r_date,
        c_name: row.c_name,
        s_address: row.s_address,
        items: []
      });
    }

    // Push item into that receipt's item list
    map.get(row.r_id).items.push({
      i_id: row.i_id,
      i_name: row.i_name,
      i_category: row.i_category,
      i_price: row.i_price
    });
  }

  // Return as an array
  return Array.from(map.values());
}
*/


export default function Review() {
    type purchasedItem = {
        i_name: number,
        i_category : string,
        i_price: number,
        s_address : string,
        c_name : string
    }



    
    
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false)
    const [searchCat, setSearchCat] = useState("")
    const [searchType, setSearchType] = useState("")
    const [searchDate, setSearchDate] = useState<Date | null>(null)
    const [recentItems, setRecentItems] = useState<purchasedItem[] | null>([])
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
      try {
          const res = await fetch(
              "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/searchRecentPurchases",
              {
                  method: "POST",
                  body: JSON.stringify({ username, category, date })
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
              setLoading(false)
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
    </div>
    )
}
