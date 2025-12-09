'use client'
import { useEffect, useState } from 'react'
import Stores from "./Stores";
import { useRouter } from 'next/navigation'
/*
USE CASE:
login admin (A&T)
2. show admin dash (A&T)
 - show number of shoppers
 - show $ amount
 - show number of sales / dollar 
*/

type StoreChain = {
  c_id: number,
  c_name: string,
  c_url: string,
  revenue: number
}

export default function AdminDashboard() {
  const [username, setUsername] = useState("")
  const [stats, setStats] = useState({
    shoppers: 0,
    revenue: 0.0,
    sales: 0
  })
  const [activeTab, setActiveTab] = useState<'HOME' | 'STORES'>('HOME')
  const [chains, setChains] = useState<StoreChain[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem("adminPassword")) {
      router.push("/loginAdmin")
    }
    

    const fetchStats = async () => {
      try {
        const res = await fetch("https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/getAdminStats", {
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
          revenue: data.totalRevenue?? 0,
          sales: data.sales ?? 0,
        })
        setChains(data.storeChainRevenues ?? [])
      } catch (err) {
        console.error("Failed to fetch admin stats", err)
      }
    }

    fetchStats()
  }, [])


  return (
    <div className="p-6">
      
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <button type="button" onClick={() => router.push("./")}>Logout</button>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">

        <button className={`px-4 py-2 rounded ${
            activeTab === 'HOME' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('HOME')}> Home </button>

        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'STORES' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('STORES')}> Stores </button>

      </div>

      {/* Tab Content */}
      {activeTab === 'HOME' && (
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

      {activeTab === 'STORES' && <Stores />}
    </div>
  )
}
