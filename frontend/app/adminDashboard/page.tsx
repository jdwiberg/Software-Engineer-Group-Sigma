'use client'
import { useEffect, useState } from 'react'

/*
USE CASE:
login admin (A&T)
2. show admin dash (A&T)
 - show number of shoppers
 - show $ amount
 - show number of sales / dollar 
*/

const AdminURL = "https://TEMP-URL"

export default function AdminDashboard() {
  const [username, setUsername] = useState("")
  const [stats, setStats] = useState({
    shoppers: 0,
    revenue: 0.0,
    sales: 0
  })

  useEffect(() => {
    const u = localStorage.getItem("username")
    if (u) setUsername(u)

    const fetchStats = async () => {
      try {
        const res = await fetch(AdminURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        })

        if (!res.ok) {
          console.error("Request failed", res.status)
          return
        }

        const data = await res.json()
        setStats({
          shoppers: data.shoppers ?? 0,
          revenue: data.revenue ?? 0,
          sales: data.sales ?? 0,
        })
      } catch (err) {
        console.error("Failed to fetch admin stats", err)
      }
    }

    fetchStats()
  }, [])


  return (
    <div className = "p-6">
      <h1 className = "text-3xl font-bold mb-4"> Admin Dashboard </h1>
      <h1 className = "text-3xl mb-4"> Welcome, {username || "Admin"}! </h1>

      <div className = "grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Shoppers */}
        <div className = "bg-white shadow rounded-xl p-4">
          <h2 className = "text-lg font-semibold"> Total Shoppers </h2>
          <p className = "text-3xl mt-2 font-bold">{stats.shoppers}</p>
        </div>

        {/* Revenue */}
        <div className = "bg-white shadow rounded-xl p-4">
          <h2 className = "text-lg font-semibold"> Total Revenue </h2>
          <p className = "text-3xl mt-2 font-bold">${stats.revenue.toFixed(2)}</p>
        </div>

        {/* Sales Count */}
        <div className = "bg-white shadow rounded-xl p-4">
          <h2 className = "text-lg font-semibold"> Number of Sales </h2>
          <p className = "text-3xl mt-2 font-bold">{stats.sales}</p>
        </div>

      </div>
    </div>
  )
}
