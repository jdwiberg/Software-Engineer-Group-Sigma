'use client'
/* 2. show admin dash (A&T)
 - show number of shoppers
 - show $ amount
 - show number of sales / dollar 
*/

import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [username, setUsername] = useState("")

  useEffect(() => {
    const u = localStorage.getItem("username")
    if (u) setUsername(u)
  }, [])

  return (
    <div>
      <h1>Welcome, {username}!</h1>
    </div>
  )
}