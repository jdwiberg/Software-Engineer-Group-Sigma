'use client'
import { useEffect, useState } from 'react'
import Stores from "./Stores";

/*
USE CASE:
login admin (A&T)
2. show admin dash (A&T)
 - show number of shoppers
 - show $ amount
 - show number of sales / dollar 
*/

export default function AdminDashboard() {
  const [username, setUsername] = useState("")
  const [stats, setStats] = useState({
    shoppers: 0,
    revenue: 0.0,
    sales: 0
  })
  const [activeTab, setActiveTab] = useState<'other' | 'stores' | 'chains'>('other')

  useEffect(() => {
    const u = localStorage.getItem("username")
    if (u) setUsername(u)

    const fetchStats = async () => {
      try {
        const res = await fetch("https://https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/getAdminStats", {
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-2xl mb-4">Welcome, {username || 'Admin'}!</h2>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'other' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('other')}
        >
          Other
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'stores' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('stores')}
        >
          Stores
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'chains' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('chains')}
        >
          Chains
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'other' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-semibold">Total Shoppers</h2>
            <p className="text-3xl mt-2 font-bold">{stats.shoppers}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-semibold">Total Revenue</h2>
            <p className="text-3xl mt-2 font-bold">${stats.revenue.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-semibold">Number of Sales</h2>
            <p className="text-3xl mt-2 font-bold">{stats.sales}</p>
          </div>
        </div>
      )}

      {activeTab === 'stores' && <Stores />}
      {/* {activeTab === 'chains' && <Chains />} */}
    </div>
  )
}
