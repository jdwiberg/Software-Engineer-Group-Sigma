'use client'
import React from 'react'
import { useState } from 'react'

export default function RegisterShopperPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("")
    setError("")
    setIsSubmitting(true)

    try {
        const res = await fetch(
            "https://7ytdy7y5xl.execute-api.us-east-1.amazonaws.com/Dev/shopper/register",
            {
                method: "POST",
                body: JSON.stringify({ username, password })
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
            setUsername("")
            setPassword("")
        }
    } catch (err) {
        console.error("something went wrong: ", err);
    } finally {
        setIsSubmitting(false)
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Register Shopper</h1>
      <form onSubmit={handleSubmit}>

        <input 
          name='username'
          type="text"
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input 
          name='username'
          type="text" 
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button 
        type='submit'
        disabled={isSubmitting}
        >
        {isSubmitting ? "Registering... " : "Submit" }
        </button>
      </form>

      {message && (
        <p>{message}</p>
      )}
      {error && (
        <p>{error}</p>
      )}

    </div>
  );
}
