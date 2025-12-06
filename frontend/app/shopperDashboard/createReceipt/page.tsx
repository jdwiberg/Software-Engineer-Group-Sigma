'use client'
import { useState } from "react"
import ReceiptForm from "./ReceiptForm"
import PhotoDropZone from  './Dropbox'
import { useRouter } from 'next/navigation';
import OpenAI from 'openai'
import sys_prompt from "./sys_prompt"



export default function CreateReceiptPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [AIisParsing, setAIisParsing] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(false)
  const router = useRouter();

  
  const toggleAi = () => {
    setAiEnabled(!aiEnabled)
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const aiHandleFile = async (file: File) => {
    setLoading(true)
    console.log("File selected: ", file)

    // Encode image file
    const encoded = await Base64Encode(file)

    // Hash AI password into API Key
    const key = getKey("prettyPlease")

    const client = new OpenAI({
      apiKey: key,
    })

    const task_prompt = "Here is the file encoded as Base64: " + encoded

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: sys_prompt },
        { role: "user", content: task_prompt },
      ],
      response_format: { type: "json_object" },
    });

    const msg = completion.choices[0].message
    const json = (msg as any).parsed ?? "{}"
    if (!json || Object.keys(json).length === 0) {
      setError("Image is not of a receipt")
    }
    
    setLoading(false)
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

  const getKey = (password: string) => {
    // do stuff with secretPassword
    return "no"
  }

  return (
    <div>
      <button type="button" onClick={() => router.push("./")}>Back</button>
      <h1>Create Receipt</h1>
      {error && <div>error</div>}
      <div>Fill out the form below to create a new receipt or
        <button type="button" onClick={() => toggleAi()}>USE AI</button>
      </div>
      {loading && <div>Loading AI Receipt...</div>}
      {aiEnabled && <PhotoDropZone onFileSubmitted={aiHandleFile}/>}
      {!submitted ? (
      <ReceiptForm onSubmit={handleSubmit} />
      ) : (
        <p>Receipt submitted successfully!</p>
      )}
    </div>
  )
}