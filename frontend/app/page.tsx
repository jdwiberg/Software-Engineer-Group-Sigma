'use client'
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { setMaxListeners } from 'events'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  localStorage.setItem("username", username)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("")
    setError("")
    setIsSubmitting(true)

    try {
        const res = await fetch(
            "https://nsnnfm38da.execute-api.us-east-1.amazonaws.com/prod/loginShopper",
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
            setMessage("Incorrect username or password, please try again.")
        } else {
            localStorage.setItem("username", body.username)
            setMessage(body.message)
            setUsername("")
            setPassword("")
            router.push('/shopperDashboard')
        }
    } catch (err) {
        console.error("something went wrong: ", err);
    } finally {
        setIsSubmitting(false)
    }
  }
  return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <h1>Login Shopper</h1>
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

        <Link href="/registerShopper">Register Shopper</Link>
        <p> </p>
        <Link href="/loginAdmin">Login Admin</Link>
      </div>
  );
}
