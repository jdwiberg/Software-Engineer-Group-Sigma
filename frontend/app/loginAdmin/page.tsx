'use client'
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { setMaxListeners } from 'events'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("")
    setError("")
    setIsSubmitting(true)

    try {
        const res = await fetch(
            "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/loginAdmin",
            {
                method: "POST",
                body: JSON.stringify({ password })
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
            setMessage("Incorrect password, please try again.")
        } else {
            localStorage.setItem("adminPassword", password)
            router.push('/adminDashboard')
        }
    } catch (err) {
        console.error("something went wrong: ", err);
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <button type="button" onClick={() => router.push("./")}>Back</button>
        <h1>Login Admin</h1>
        <form onSubmit={handleSubmit}>

          <input 
            name='password'
            type="password" 
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button 
          type='submit'
          disabled={isSubmitting}
          >
          {isSubmitting ? "Logging you in... " : "Log In" }
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
