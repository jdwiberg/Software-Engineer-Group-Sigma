'use client'
import { useState } from "react"
import ReceiptForm from "./ReceiptForm"

export default function CreateReceiptPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
  }

  return (
    <div>
      <h1>Create Receipt</h1>
      {!submitted ? (
        <ReceiptForm onSubmit={handleSubmit} />
      ) : (
        <p>Receipt submitted successfully!</p>
      )}
    </div>
  )
}