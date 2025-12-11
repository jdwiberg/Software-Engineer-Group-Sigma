'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { get } from 'http'
import formatDate from '../aa-utils/formatDate'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function Review() {
    type PurchasedItem = {
        i_id : number,
        i_name: string,
        i_category : string,
        i_price : number,
        r_date : string,
        c_name : string,
        s_address : string
    }

    type ActivityReport = {
        type : string, 
        storesShopped : string[],
        totalSpent : number,
        numReceipts : number
    }

    const [messageRP, setMessageRP] = useState("")
    const [messageRA, setMessageRA] = useState("")
    const [username, setUsername] = useState("")
    //for searching recent purchases
    const [searchCat, setSearchCat] = useState("")  
    const [searchTypeRP, setSearchTypeRP] = useState("")
    const [searchDateRP, setSearchDateRP] = useState<Date | null>(null)
    const [recentPurchases, setRecentPurchases] = useState<PurchasedItem[] | null>([])
    const [searchingRP, setSearchingRP] = useState(false)
    const [foundRP, setFoundRP] = useState(false)
    //for generating activity report
    const [activity, setActivity] = useState("")  
    const [shopReport, setShopReport] = useState<ActivityReport | null>(null)
    const [searchTypeRA, setSearchTypeRA] = useState("")
    const [startSearchDateRA, setStartSearchDateRA] = useState<Date | null>(null)
    const [endSearchDateRA, setEndSearchDateRA] = useState<Date | null>(null)
    const [searchingRA, setSearchingRA] = useState(false)
    const [foundRA, setFoundRA] = useState(false)

    const categories = [
        "All",
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
    const router = useRouter()

    function findSearchDate(type : string): Date {
        let todaysDate = new Date()
        let prevDate = new Date(todaysDate)
        if (type === "Past Day"){
            prevDate.setDate(todaysDate.getDate() - 1)
        }
        else if (type === "Past Week"){
            prevDate.setDate(todaysDate.getDate() - 7)
        }
        else if (type === "Past Month"){
            prevDate.setMonth(todaysDate.getMonth() - 1)
        }
        else if (type === "All time"){
            prevDate.setDate(0)
        }
        return prevDate
    }

    function generateReport(rows: any) {
        const storeSet = new Set<string>()       // To keep unique stores
        const receiptSet = new Set<number>()    // To keep unique receipt IDs
        let totalSpent = 0

        for (const row of rows) {
            // Add store to the set (unique automatically)
            storeSet.add(`${row.c_name} ${row.s_address}`);

            // Add receipt ID
            receiptSet.add(row.r_id)

            // Add price
            totalSpent += row.i_price
        }

        const newReport: ActivityReport = {
                type: searchTypeRA, 
                storesShopped: Array.from(storeSet),
                totalSpent: totalSpent,
                numReceipts: receiptSet.size,
        }
        setShopReport(newReport);
    }

    useEffect(() => {
    const u = localStorage.getItem("username")
    if (u) setUsername(u)
    }, [])

    useEffect(() => {
    if (username) {
    }
    }, [username])
    
    async function getRecents(date : Date, category : string) {  
        if (category === "All") {
            category = '*'
        }
        setSearchingRP(true)
        setFoundRP(true)
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
                setMessageRP(body.error)
            } else {
                setMessageRP("")
                setRecentPurchases(body.recentPurchases)
                setSearchingRP(false)
                setSearchCat("")
                setSearchTypeRP("")
            }
        } catch (err) {
            console.error("something went wrong: ", err);
        }
        }

    async function getActivity(startDate : Date, endDate : Date) {  
    setSearchingRA(true)
    setFoundRA(true)
    if (
            startDate.getFullYear() === endDate.getFullYear() &&
            startDate.getMonth() === endDate.getMonth() &&
            startDate.getDate() === endDate.getDate()
        ) {
            startDate.setHours(0, 0, 0, 0)                 
            endDate.setHours(23, 59, 59, 999)
        }
      try {
          const res = await fetch(
              "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/reviewActivity",
              {
                  method: "POST",
                  body: JSON.stringify({ username, startDate, endDate })
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
              setMessageRA(body.error)
          }
          else {
              setMessageRA("")
              setSearchTypeRA("")
              setStartSearchDateRA(null)
              setEndSearchDateRA(null)
              setActivity(body.recentActivity)
              generateReport(body.recentActivity)
              setSearchingRA(false)
          }
      } catch (err) {
          console.error("something went wrong: ", err);
      }
    }

    return (
    <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
        <h2>Search Recent Purchases</h2>
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
            value={searchTypeRP}
            onChange={(e) => {
                setSearchTypeRP(e.target.value), 
                setSearchDateRP(findSearchDate(e.target.value)), 
                console.log(searchDateRP)
            }}
            required
        >
            <option value="">Search by </option>
            {dateTypes.map((type) => (
                <option key={type} value={type}>
                    {type}
                </option>
            ))}
        </select>
        <button onClick={() => getRecents(searchDateRP!, searchCat!)}>Search Recent Purchases</button>
        {messageRP ? (
            <p>{messageRP}</p>
        ) : recentPurchases && recentPurchases.length > 0? (
            <div>
                <h3>Purchases Of {recentPurchases[0]?.i_category} :</h3>
                {recentPurchases.map((item: PurchasedItem) => (
                <div key={item.i_id}>
                    <h4>{item.i_name} ${item.i_price.toFixed(2)}</h4>
                    <p>{item.c_name}, {item.s_address}</p>
                    <p>{formatDate(item.r_date)}</p>
                </div>
                ))}
            </div>
        ) : (
            <p>{(searchingRP)? "Loading..." : (foundRP) ? "No recent purchases!" : " " }</p>
        )}
        </div>

        <div style={{ flex: 1 }}>
        <h2>Generate Shopping Activity Report</h2>
        <DatePicker
            selected={startSearchDateRA}
            onChange={(date) => setStartSearchDateRA(date)}
            placeholderText="Select a start date"
            dateFormat="yyyy-MM-dd"
        />
        <DatePicker
            selected={endSearchDateRA}
            onChange={(date) => setEndSearchDateRA(date)}
            placeholderText="Select an end date"
            dateFormat="yyyy-MM-dd"
        />
        <button onClick={() => getActivity(startSearchDateRA!, endSearchDateRA!)}>Generate Report</button>
        {messageRA ? (
            <p>{messageRA}</p>
        ) : activity && activity.length > 0 ? (
            <div>
                <h3>Your Shopping Summary:</h3>
                <h4>Your stores:</h4>
                {shopReport?.storesShopped.map((store, idx) => (
                    <p key={idx}>{store}</p>
                ))}
                <h4>Shopping trips: <span>{shopReport?.numReceipts}</span></h4>
                <h4>Total spent: $<span>{shopReport?.totalSpent.toFixed(2)}</span></h4>
            </div>
        ) : (
            <p>{(searchingRA)? "Loading..." : (foundRA) ? "No recent activity!" : " " }</p>
        )}
        </div>
    </div>
    )
}
