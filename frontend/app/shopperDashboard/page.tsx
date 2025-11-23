'use client'
import { useEffect, useState } from 'react'

export default function ShopperDashboard() {
  const [username, setUsername] = useState("")

  useEffect(() => {
    const u = localStorage.getItem("username")
    if (u) setUsername(u)
  }, [])

  return (
    <div>
      
      <h1>Welcome, {String(username)}!</h1>
    </div>
  )
}