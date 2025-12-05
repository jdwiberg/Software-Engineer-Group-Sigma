'use client'
import { useState } from "react"
import ReceiptForm from "./ReceiptForm"
import PhotoDropZone from  './Dropbox'
import { useRouter } from 'next/navigation';


export default function CreateReceiptPage() {
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [AIisParsing, setAIisParsing] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(false)
  const [file, setFile] = useState<string | null>(null)
  const router = useRouter();
  
  const toggleAi = () => {
    setAiEnabled(!aiEnabled)
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const aiHandleFile = async (file: File) => {
    console.log("File selected: ", file)
    const encoded = await Base64Encode(file)
    return 1
  }

  const Base64Encode = (file: File): Promise<string> => {
    return new Promise ((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64string = reader.result as string
        resolve(base64string.split(',')[1])
      }
      reader.onerror = (error) => reject(error)
    })
  }

  return (
    <div>
      <button type="button" onClick={() => router.push("./")}>Back</button>
      <h1>Create Receipt</h1>
      <p>Fill out the form below to create a new receipt or <button type="button" onClick={() => toggleAi()}>USE AI</button></p>
      {aiEnabled && <PhotoDropZone onFileSubmitted={aiHandleFile}/>}
      {!submitted ? (
      <ReceiptForm onSubmit={handleSubmit} />
      ) : (
        <p>Receipt submitted successfully!</p>
      )}
    </div>
  )
}